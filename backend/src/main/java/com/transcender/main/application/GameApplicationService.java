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

    // Jogadores esperando partida
    private final Queue<UserCore> waitingPlayersNomalGame = new ConcurrentLinkedQueue<>();
    private final List<Long> playersInMatcher = new CopyOnWriteArrayList<>();

    // Controle de tempo na fila
    private final Map<Long, Long> waitingSince = new ConcurrentHashMap<>();


    private final Map<String, InviteData> pendingInvites = new ConcurrentHashMap<>();
    // ===================== DTO =====================

    // Classe auxiliar para armazenar o convite
    private record InviteData(Long inviterId, Long invitedId, long createdAt) {
    }

    @Override
    public void addToQueue(Long playerId, String typeMode) {
        if (playersInMatcher.contains(playerId)) return;

        Optional<UserCore> user = userRepository.getUserById(playerId);
        if (user.isEmpty()) return;

        if (waitingPlayersNomalGame.contains(user.get())) return;

        waitingPlayersNomalGame.add(user.get());
        playersInMatcher.add(playerId);
        waitingSince.put(playerId, System.currentTimeMillis());

        // Se houver pelo menos 2 jogadores → cria partida
        if (waitingPlayersNomalGame.size() >= 2) {
            UserCore player1 = waitingPlayersNomalGame.poll();
            UserCore player2 = waitingPlayersNomalGame.poll();

            playersInMatcher.add(player1.getId());
            playersInMatcher.add(player2.getId());

            waitingSince.remove(player1.getId());
            waitingSince.remove(player2.getId());

            String roomId = UUID.randomUUID().toString();
            createRoom(roomId, player1, player2, typeMode);
        } else {
            messagingTemplate.convertAndSend("/topic/addPlayer/" + playerId,
                    Map.of("message", "Player adicionado à fila"));
        }
    }

    @Override
    public void createRoom(String roomId, UserCore player1, UserCore player2, String mode) {
        logger.info("Criando uma nova partida entre player1={} player2={}", player1.getId(), player2.getId());

        // Remove convites antigos envolvendo esses jogadores
        pendingInvites.entrySet().removeIf(entry ->
                entry.getValue().inviterId().equals(player1.getId())
                        || entry.getValue().inviterId().equals(player2.getId())
                        || entry.getValue().invitedId().equals(player1.getId())
                        || entry.getValue().invitedId().equals(player2.getId())
        );

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

    // ===================== Jogo =====================

    public void handleMove(PlayerMoveDto move) {
        PongGame game = games.get(move.roomID());
        if (game != null) {
            game.movePlayer(move);
            messagingTemplate.convertAndSend("/topic/game/" + move.roomID(), new GamePongDto(game));
        }
    }

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

                        messagingTemplate.convertAndSend("/topic/game/" + game.getRoomId(),  new GamePongDto(game));
                        games.remove(game.getRoomId());
                        playersInMatcher.remove(game.getPlayerLeft().getId());
                        playersInMatcher.remove(game.getPlayerRight().getId());
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
                        waitingPlayersNomalGame.removeIf(u -> u.getId().equals(playerId));
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
                    Map.of("error", "Você já está na fila e não pode criar convite."));
            return null;
        }

        // Verifica se já existe convite pendente entre os dois jogadores
        boolean alreadyInvited = pendingInvites.values().stream().anyMatch(invite ->
                (invite.inviterId().equals(inviterId) && invite.invitedId().equals(invitedId)) ||
                        (invite.inviterId().equals(invitedId) && invite.invitedId().equals(inviterId))
        );

        if (alreadyInvited) {
            messagingTemplate.convertAndSend("/topic/invite/" + inviterId,
                    Map.of("error", "Já existe um convite pendente entre vocês. So poderá criar outro daqui 1m"));
            return null;
        }


        Optional<UserCore> inviter = userRepository.getUserById(inviterId);
        Optional<UserCore> invited = userRepository.getUserById(invitedId);

        if (inviter.isEmpty() || invited.isEmpty()) {
            return null;
        }

        // Cria uma sala UUID exclusiva
        String roomId = UUID.randomUUID().toString();

        pendingInvites.put(roomId, new InviteData(inviterId, invitedId, System.currentTimeMillis()));

        // Notifica o convidado
        UserCore userInviter = userRepository.getUserById(inviterId).orElseThrow(() -> new ResourceNotFound("user", inviterId));

        messagingTemplate.convertAndSend("/topic/invite/" + invitedId,
                Map.of("roomId", roomId, "player", userInviter, "message", "Você recebeu um convite para jogar!")
        );

        // Agenda timeout de 1 minuto
        ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
        scheduler.schedule(() -> cancelInviteAfterTimeout(roomId), 1, TimeUnit.MINUTES);

        logger.info("Convite criado: roomId={} inviter={} invited={}", roomId, inviterId, invitedId);

        return roomId;
    }

    @Override
    public void acceptInvite(Long invitedId, String roomId) {
        InviteData invite = pendingInvites.get(roomId);
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

        // Remove ambos da fila normal (caso estejam esperando)
        waitingPlayersNomalGame.removeIf(u ->
                u.getId().equals(invite.inviterId()) || u.getId().equals(invite.invitedId()));

        playersInMatcher.remove(invite.inviterId());
        playersInMatcher.remove(invite.invitedId());
        waitingSince.remove(invite.inviterId());
        waitingSince.remove(invite.invitedId());


        PongGame game = games.computeIfAbsent(roomId, r -> new PongGame(roomId, "invite"));
        game.addPlayer(inviter.get(), invited.get());

        Map<String, Object> response = Map.of(
                "roomId", roomId,
                "playerLeft", game.getPlayerLeft(),
                "playerRight", game.getPlayerRight()
        );

        messagingTemplate.convertAndSend("/topic/matchmaking/" + invite.inviterId(), response);
        messagingTemplate.convertAndSend("/topic/matchmaking/" + invite.invitedId(), response);

        // Remove o convite ativo
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

    public void notifyPlayer(Long playerId, Map<String, Object> payload) {
        messagingTemplate.convertAndSend("/topic/invite/" + playerId, payload);
    }

    public void notifyError(Long playerId, String message) {
        messagingTemplate.convertAndSend("/topic/invite/" + playerId,
                Map.of("error", message));
    }

}
