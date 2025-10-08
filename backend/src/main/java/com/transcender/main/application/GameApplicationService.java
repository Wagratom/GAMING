package com.transcender.main.application;

import com.transcender.main.domain.entity.MatchCore;
import com.transcender.main.domain.entity.PongGame;
import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.exceptions.ResourceNotFound;
import com.transcender.main.domain.port.in.GamePort;
import com.transcender.main.domain.port.out.MatchRepositoryPort;
import com.transcender.main.domain.port.out.UserRepositoryPort;
import com.transcender.main.domain.valueobject.GamePongDto;
import com.transcender.main.domain.valueobject.PlayerMoveDto;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.*;

@Service
@RequiredArgsConstructor
public class GameApplicationService implements GamePort {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepositoryPort userRepository;
    private final MatchRepositoryPort matchRepository;
    private final Logger logger = LoggerFactory.getLogger(GameApplicationService.class);

    // Jogos ativos
    private final Map<String, PongGame> games = new ConcurrentHashMap<>();

    // Jogadores esperando partida (agora armazenamos apenas IDs)
    private final Queue<Long> waitingPlayersNormalGame = new ConcurrentLinkedQueue<>();
    private final List<Long> playersInMatcher = new CopyOnWriteArrayList<>();

    // Controle de tempo na fila
    private final Map<Long, Long> waitingSince = new ConcurrentHashMap<>();

    // Convites pendentes
    private final Map<String, InviteData> pendingInvites = new ConcurrentHashMap<>();

    // Classe auxiliar para armazenar o convite
    private record InviteData(Long inviterId, Long invitedId, long createdAt) {}

    private record Player(String nickname, Long id, String avatar){};
    // ===================== FILA NORMAL =====================

    @Override
    public void addToQueue(Long playerId, String typeMode) {
        logger.info("[INIT] add queue");
        if (playersInMatcher.contains(playerId)) return;

        Optional<UserCore> user = userRepository.getUserById(playerId);
        if (user.isEmpty()) return;

        if (waitingPlayersNormalGame.contains(playerId)) return;

        logger.info("Adicionando player {} à fila normal", playerId);
        waitingPlayersNormalGame.add(playerId);
        waitingSince.put(playerId, System.currentTimeMillis());

        // Se houver pelo menos 2 jogadores → cria partida
        if (waitingPlayersNormalGame.size() >= 2) {
            Long player1Id = waitingPlayersNormalGame.poll();
            Long player2Id = waitingPlayersNormalGame.poll();

            if (player1Id == null || player2Id == null) return;

            playersInMatcher.add(player1Id);
            playersInMatcher.add(player2Id);

            waitingSince.remove(player1Id);
            waitingSince.remove(player2Id);

            // Remove convites antigos envolvendo esses jogadores
            pendingInvites.entrySet().removeIf(entry ->
                    entry.getValue().inviterId().equals(player1Id)
                            || entry.getValue().inviterId().equals(player2Id)
                            || entry.getValue().invitedId().equals(player1Id)
                            || entry.getValue().invitedId().equals(player2Id)
            );

            UserCore player1 = userRepository.getUserById(player1Id).orElseThrow();
            UserCore player2 = userRepository.getUserById(player2Id).orElseThrow();

            String roomId = UUID.randomUUID().toString();
            createRoom(roomId, player1, player2, typeMode);
        } else {
            messagingTemplate.convertAndSend("/topic/addPlayer/" + playerId,
                    Map.of("message", "Player adicionado à fila"));
        }
    }

    @Override
    public void createRoom(String roomId, UserCore player1, UserCore player2, String mode) {
        logger.info("Criando nova partida entre player1={} e player2={}", player1.getId(), player2.getId());

        PongGame game = games.computeIfAbsent(roomId, r -> new PongGame(roomId, mode));
        game.addPlayer(player1, player2);

        Map<String, Object> response = Map.of(
                "roomId", roomId,
                "playerLeft", game.getPlayerLeft(),
                "playerRight", game.getPlayerRight()
        );

        messagingTemplate.convertAndSend("/topic/matchmaking/" + player1.getId(), response);
        messagingTemplate.convertAndSend("/topic/matchmaking/" + player2.getId(), response);

        logger.info("Games ativos: {}", games.size());
    }

    // ===================== MOVIMENTOS =====================

    public void handleMove(PlayerMoveDto move) {
        PongGame game = games.get(move.roomID());
        if (game != null) {
            game.movePlayer(move);
            messagingTemplate.convertAndSend("/topic/game/" + move.roomID(), new GamePongDto(game));
        }
    }

    // ===================== LOOP PRINCIPAL =====================

    @PostConstruct
    public void startLoop() {
        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);

        // Loop do jogo
        scheduler.scheduleAtFixedRate(() -> {
            try {
                games.values().forEach(game -> {
                    game.updateBall();
                    messagingTemplate.convertAndSend("/topic/game/" + game.getRoomId(), new GamePongDto(game));

                    if (game.isFinished()) {
                        MatchCore newMatch = matchRepository.createMatch(
                                "Default",
                                game.getWinnerId(),
                                game.getLoserId(),
                                game.getScoreWinner(),
                                game.getScoreLoser()
                        );

                        messagingTemplate.convertAndSend("/topic/game/" + game.getRoomId(), new GamePongDto(game));

                        // Remove ambos os jogadores de todas as filas e convites
                        removePlayerFromAllQueues(game.getPlayerLeft().getId());
                        removePlayerFromAllQueues(game.getPlayerRight().getId());

                        games.remove(game.getRoomId());
                        logger.info("Partida finalizada e jogadores limpos: {}", game.getRoomId());
                    }
                });
            } catch (Exception e) {
                logger.error("Erro no loop do jogo", e);
            }
        }, 0, 50, TimeUnit.MILLISECONDS);

        // Verificação da fila (limite de 5 min)
        scheduler.scheduleAtFixedRate(() -> {
            try {
                long now = System.currentTimeMillis();
                long maxWaiting = TimeUnit.MINUTES.toMillis(5);

                waitingSince.forEach((playerId, since) -> {
                    if (now - since > maxWaiting) {
                        waitingPlayersNormalGame.remove(playerId);
                        playersInMatcher.remove(playerId);
                        waitingSince.remove(playerId);

                        messagingTemplate.convertAndSend("/topic/queueTimeout/" + playerId,
                                Map.of("message", "Você foi removido da fila por tempo excedido."));
                        logger.info("Jogador {} removido da fila por tempo excedido", playerId);
                    }
                });
            } catch (Exception e) {
                logger.error("Erro ao verificar fila", e);
            }
        }, 0, 1, TimeUnit.SECONDS);
    }

    // ===================== INVITES =====================

    @Override
    public String createInviteRoom(Long inviterId, Long invitedId) {
        if (playersInMatcher.contains(inviterId)) {
            messagingTemplate.convertAndSend("/topic/invite/" + inviterId,
                    Map.of("msg", "Você já está na fila e não pode criar convite."));
            return null;
        }

        boolean alreadyInvited = pendingInvites.values().stream().anyMatch(invite ->
                (invite.inviterId().equals(inviterId) && invite.invitedId().equals(invitedId)) ||
                        (invite.inviterId().equals(invitedId) && invite.invitedId().equals(inviterId))
        );

        if (alreadyInvited) {
            messagingTemplate.convertAndSend("/topic/invite/" + inviterId,
                    Map.of("msg", "Já existe um convite pendente entre vocês. Tente novamente em 1 minuto."));
            return null;
        }

        Optional<UserCore> inviter = userRepository.getUserById(inviterId);
        Optional<UserCore> invited = userRepository.getUserById(invitedId);

        if (inviter.isEmpty() || invited.isEmpty()) return null;

        String roomId = UUID.randomUUID().toString();
        pendingInvites.put(roomId, new InviteData(inviterId, invitedId, System.currentTimeMillis()));

        UserCore userInviter = inviter.get();
        messagingTemplate.convertAndSend("/topic/invite/" + invitedId,
                Map.of(
                        "roomId", roomId,
                        "player", new Player(userInviter.getNickname(), userInviter.getId(), userInviter.getAvatar()),
                        "message", "Você recebeu um convite para jogar!"
                )
        );

        messagingTemplate.convertAndSend("/topic/invite/" + inviterId,
                Map.of("msg", "Convite enviado com sucesso"));

        // Agenda timeout de 1 minuto
        ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
        scheduler.schedule(() -> cancelInviteAfterTimeout(roomId), 1, TimeUnit.MINUTES);

        logger.info("Convite criado: roomId={} inviter={} invited={}", roomId, inviterId, invitedId);
        return roomId;
    }

    @Override
    public void acceptInvite(Long invitedId, String roomId) {
        InviteData invite = pendingInvites.get(roomId);
        logger.info("Accept invite {} invitedId {}", invite, invitedId);
        if (invite == null) {
            messagingTemplate.convertAndSend("/topic/invite/" + invitedId,
                    Map.of("error", "Convite expirado ou inválido."));
            return;
        }

        if (!Objects.equals(invite.invitedId(), invitedId)) {
            messagingTemplate.convertAndSend("/topic/invite/" + invitedId,
                    Map.of("error", "Você não é o convidado desta sala."));
            return;
        }

        Optional<UserCore> inviter = userRepository.getUserById(invite.inviterId());
        Optional<UserCore> invited = userRepository.getUserById(invite.invitedId());

        if (inviter.isEmpty() || invited.isEmpty()) {
            pendingInvites.remove(roomId);
            return;
        }

        // Remove ambos de todas as filas, convites e matcher
        removePlayerFromAllQueues(invite.inviterId());
        removePlayerFromAllQueues(invite.invitedId());

        PongGame game = games.computeIfAbsent(roomId, r -> new PongGame(roomId, "invite"));
        game.addPlayer(inviter.get(), invited.get());

        Map<String, Object> response = Map.of(
                "roomId", roomId,
                "playerLeft", game.getPlayerLeft(),
                "playerRight", game.getPlayerRight()
        );

        logger.info("notificando players {} e {}", invite.inviterId(), invite.invitedId());
        messagingTemplate.convertAndSend("/topic/matchmaking/" + invite.inviterId(), response);
        messagingTemplate.convertAndSend("/topic/matchmaking/" + invite.invitedId(), response);

        pendingInvites.remove(roomId);
        logger.info("Convite aceito e jogo iniciado: {}", roomId);
    }

    private void cancelInviteAfterTimeout(String roomId) {
        InviteData invite = pendingInvites.remove(roomId);
        if (invite != null) {
            messagingTemplate.convertAndSend("/topic/invite/" + invite.inviterId(),
                    Map.of("message", "Convite expirou após 1 minuto."));
            messagingTemplate.convertAndSend("/topic/invite/" + invite.invitedId(),
                    Map.of("message", "Convite expirou antes de ser aceito."));
            logger.info("Convite expirado: {}", roomId);
        }
    }

    // ===================== UTIL =====================

    private void removePlayerFromAllQueues(Long playerId) {
        waitingPlayersNormalGame.remove(playerId);
        playersInMatcher.remove(playerId);
        waitingSince.remove(playerId);

        pendingInvites.entrySet().removeIf(entry ->
                entry.getValue().inviterId().equals(playerId) ||
                        entry.getValue().invitedId().equals(playerId)
        );
    }

    public void notifyPlayer(Long playerId, Map<String, Object> payload) {
        messagingTemplate.convertAndSend("/topic/invite/" + playerId, payload);
    }

    public void notifyError(Long playerId, String message) {
        messagingTemplate.convertAndSend("/topic/invite/" + playerId,
                Map.of("error", message));
    }
}
