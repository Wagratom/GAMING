package com.transcender.main.application;

import com.transcender.main.domain.entity.MatchCore;
import com.transcender.main.domain.entity.PongGame;
import com.transcender.main.domain.port.out.MatchRepositoryPort;
import com.transcender.main.domain.valueobject.PlayerMoveDto;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class GameApplicationService {

    private final SimpMessagingTemplate messagingTemplate;

    //Map com as partidas que estão acontecendo no momento
    private final Map<String, PongGame> games = new ConcurrentHashMap<>();

    // Fila de espera para matchmaking
    private final Queue<Long> waitingPlayersNomalGame = new ConcurrentLinkedQueue<>();
    private final MatchRepositoryPort matchRepository;

    private final Logger logger = LoggerFactory.getLogger(GameApplicationService.class);
    private record GamePongDto(
            BallDto ball,
            PaddleDto paddleLeft,
            PaddleDto paddleRight,
            int placarLeft,
            int placarRight,
            String winner,
            WindowDto window,
            PlayerDto player_left,
            PlayerDto player_right,
            List<String> watchs,
            PowerDto power
    ) {
        public record BallDto(int positionX, int positionY, int size) {}
        public record PaddleDto(int positionX, int positionFront, int height, int width, int velocity) {}
        public record WindowDto(int height, int width) {}
        public record PlayerDto(String id, boolean status, String nickname) {}
        public record PowerDto(int x, int y, int size) {}
    }

    public void addToQueue(Long playerId, String typeMode) {
        if (waitingPlayersNomalGame.contains(playerId)) return;
        // Se houver pelo menos 2 jogadores, cria uma partida
        waitingPlayersNomalGame.add(playerId);
        if (waitingPlayersNomalGame.size() >= 2) {
            Long player1 = waitingPlayersNomalGame.poll();
            Long player2 = waitingPlayersNomalGame.poll();

            String roomId = UUID.randomUUID().toString();
            createRoom(roomId, player1, player2, typeMode);
        } else {
            messagingTemplate.convertAndSend("/topic/addPlayer/" + playerId, Map.of("message", "Player adicionado a fila"));
        }
    }

    private void createRoom(String roomId, Long playerId1, Long playerId2, String mode) {
        logger.info("Criando uma nova partida entre player1={} player2={}", playerId1, playerId2);
        PongGame game = games.computeIfAbsent(roomId, r -> new PongGame(roomId, mode));
        game.addPlayer(playerId1, playerId2);

        messagingTemplate.convertAndSend("/topic/matchmaking/" + playerId1, Map.of("roomId", roomId));
        messagingTemplate.convertAndSend("/topic/matchmaking/" + playerId2, Map.of("roomId", roomId));
        logger.info("Games ativos no loop2: {}", games.size());
    }

    public void handleMove(PlayerMoveDto move) {
        logger.info("Move cheguei: {}", move);
        PongGame game = games.get(move.roomID());
        if (game != null) {
            logger.info("Move passei");
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

                        GamePongDto dto = toDto(game);
                        messagingTemplate.convertAndSend("/topic/game/" + game.getRoomId(), toDto(game));
                        games.remove(game.getRoomId());
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
                game.isFinished() ? String.valueOf(game.getWinnerId()) : "",
                new GamePongDto.WindowDto(game.getHeight(), game.getWidth()),
                new GamePongDto.PlayerDto(String.valueOf(game.getPlayerLeftId()), true, "nickname_left"),
                new GamePongDto.PlayerDto(String.valueOf(game.getPlayerRightId()), true, "nickname_right"),
                List.of(),
                new GamePongDto.PowerDto(0, 0, 0)
        );
    }

}
