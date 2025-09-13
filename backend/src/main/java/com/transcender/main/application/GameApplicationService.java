package com.transcender.main.application;

import com.transcender.main.domain.entity.MatchCore;
import com.transcender.main.domain.entity.PongGame;
import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.port.out.MatchRepositoryPort;
import com.transcender.main.domain.port.out.UserRepositoryPort;
import com.transcender.main.domain.valueobject.PlayerMoveDto;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class GameApplicationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepositoryPort userRepository;

    //Map com as partidas que estão acontecendo no momento
    private final Map<String, PongGame> games = new ConcurrentHashMap<>();

    // Fila de espera para matchmaking
    private final Queue<UserCore> waitingPlayersNomalGame = new ConcurrentLinkedQueue<>();
    private  final List<Long> playersInMatcher;
    private final MatchRepositoryPort matchRepository;

    private final Logger logger = LoggerFactory.getLogger(GameApplicationService.class);

    private record GamePongDto(
            BallDto ball,
            PaddleDto paddleLeft,
            PaddleDto paddleRight,
            int placarLeft,
            int placarRight,
            Long winner,
            WindowDto window,
            PowerDto power,
            Long playerLeftId,
            Long playerRightId
    ) {
        public record BallDto(int positionX, int positionY, int size) {
        }

        public record PaddleDto(int positionX, int positionFront, int height, int width, int velocity) {
        }

        public record WindowDto(int height, int width) {
        }

        public record PowerDto(int x, int y, int size) {
        }
    }

    public void addToQueue(Long playerId, String typeMode) {
        if (playersInMatcher.contains(playerId)) return;

        Optional<UserCore> user = userRepository.getUserById(playerId);
        logger.info("{}", user.isEmpty());
        if (user.isEmpty()) return;

        if (waitingPlayersNomalGame.contains(user.get())) return;

        // Se houver pelo menos 2 jogadores, cria uma partida
        waitingPlayersNomalGame.add(user.get());
        if (waitingPlayersNomalGame.size() >= 2) {
            UserCore player1 = waitingPlayersNomalGame.poll();
            UserCore player2 = waitingPlayersNomalGame.poll();

            playersInMatcher.add(player1.getId());
            playersInMatcher.add(player2.getId());

            String roomId = UUID.randomUUID().toString();
            createRoom(roomId, player1, player2, typeMode);
        } else {
            messagingTemplate.convertAndSend("/topic/addPlayer/" + playerId, Map.of("message", "Player adicionado a fila"));
        }
    }

    private void createRoom(String roomId, UserCore player1, UserCore player2, String mode) {
        logger.info("Criando uma nova partida entre player1={} player2={}", player1.getId(), player2.getId());
        PongGame game = games.computeIfAbsent(roomId, r -> new PongGame(roomId, mode));
        game.addPlayer(player1, player2);
        Map<String, Object> response = Map.of(
                "roomId", roomId,
                "playerLeft", game.getPlayerLeft(),
                "playerRight", game.getPlayerRight()
        );
        messagingTemplate.convertAndSend("/topic/matchmaking/" + player1.getId(), response);
        messagingTemplate.convertAndSend("/topic/matchmaking/" + player2.getId(), response);
        logger.info("Games ativos no loop2: {}", games.size());
    }

    public void handleMove(PlayerMoveDto move) {
        logger.info("Move cheguei: {}", move);
        PongGame game = games.get(move.roomID());
        if (game != null) {
            game.movePlayer(move);
            messagingTemplate.convertAndSend("/topic/game/" + move.roomID(), toDto(game));
        }
    }

    @PostConstruct
    public void startLoop() {
        Executors.newSingleThreadScheduledExecutor().scheduleAtFixedRate(() -> {
            try {
                games.values().forEach(game -> {
                    game.updateBall();
                    messagingTemplate.convertAndSend("/topic/game/" + game.getRoomId(), toDto(game));

                    if (game.isFinished()) {
                        MatchCore newMatch = matchRepository.createMatch(
                                "Default",
                                game.getWinnerId(),
                                game.getLoserId(),
                                game.getScoreWinner(),
                                game.getScoreLoser()
                        );

                        messagingTemplate.convertAndSend("/topic/game/" + game.getRoomId(), toDto(game));
                        games.remove(game.getRoomId());
                        playersInMatcher.remove(game.getPlayerLeft().getId());
                        playersInMatcher.remove(game.getPlayerRight().getId());
                    }
                });
            } catch (Exception e) {
                logger.error("Erro no loop do jogo", e);
            }
        }, 0, 50, TimeUnit.MILLISECONDS);
    }

    private GamePongDto toDto(PongGame game) {
        return new GamePongDto(
                new GamePongDto.BallDto(game.getBallX(), game.getBallY(), game.getBallSize()),
                new GamePongDto.PaddleDto(0, game.getLeftPaddleY(), game.getPaddleHeight(), game.getPaddleWidth(), 5),
                new GamePongDto.PaddleDto(game.getWidth() - game.getPaddleWidth(), game.getRightPaddleY(), game.getPaddleHeight(), game.getPaddleWidth(), 5),
                game.getScoreLeft(),
                game.getScoreRight(),
                game.isFinished() ? game.getWinnerId() : null,
                new GamePongDto.WindowDto(game.getHeight(), game.getWidth()),
                new GamePongDto.PowerDto(0, 0, 0),
                game.getPlayerLeft().getId(),
                game.getPlayerRight().getId()
        );
    }


}
