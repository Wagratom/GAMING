package com.transcender.main.application;

import com.transcender.main.domain.entity.PongGame;
import com.transcender.main.domain.exceptions.BadRequest;
import com.transcender.main.domain.valueobject.PlayerMove;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

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
    private final Queue<Long> waitingPlayersRanquedGame = new ConcurrentLinkedQueue<>();
    private final Queue<Long> VsCoopGame = new ConcurrentLinkedQueue<>();

    private final Logger logger = LoggerFactory.getLogger(GameApplicationService.class);

    public void addToQueue(Long playerId, String typeMode) {
        Queue<Long> queue;

        switch (typeMode) {
            case "Normal":
                queue = waitingPlayersNomalGame;
                break;
            case "Ranqueado":
                queue = waitingPlayersRanquedGame;
                break;
            case "VSCOOP":
                queue = VsCoopGame;
                break;
            default:
                return;
        }


        if (waitingPlayersNomalGame.contains(playerId)
                || waitingPlayersRanquedGame.contains(playerId)
                || VsCoopGame.contains(playerId)
        ) return;
        // Se houver pelo menos 2 jogadores, cria uma partida
        logger.info("Adicionando novo player '{}' na fila '{}'", typeMode, playerId);
        queue.add(playerId);
        if (queue.size() >= 2) {
            Long player1 = queue.poll();
            Long player2 = queue.poll();

            String roomId = UUID.randomUUID().toString();
            createRoom(roomId, player1, player2, typeMode);

        } else {
            logger.info("topic name: {}", "/topic/addPlayer/" + playerId);
            messagingTemplate.convertAndSend("/topic/addPlayer/" + playerId,  Map.of("message", "Player adicionado a fila"));
        }
    }

    private void createRoom(String roomId, Long playerId1, Long playerId2, String mode) {
        logger.info("Criando uma nova partida entre player1={} player2={}", playerId1, playerId2);
        PongGame game = games.computeIfAbsent(roomId, r -> new PongGame(roomId, mode));
        game.addPlayer(playerId1, playerId2);

        messagingTemplate.convertAndSend("/topic/matchmaking/" + playerId1, roomId);
        messagingTemplate.convertAndSend("/topic/matchmaking/" + playerId2, roomId);
    }


    public void handleMove(PlayerMove move) {
        PongGame game = games.get(move.roomId());
        if (game != null) {
            game.movePlayer(move);
            messagingTemplate.convertAndSend("/topic/game/" + move.roomId(), game);
        }
    }

    @PostConstruct
    public void startLoop() {
        Executors.newSingleThreadScheduledExecutor().scheduleAtFixedRate(() -> {
            games.values().forEach(game -> {
                game.updateBall();
                messagingTemplate.convertAndSend("/topic/game/" + game.getRoomId(), game);
            });
        }, 0, 50, TimeUnit.MILLISECONDS); // 20 FPS
    }
}
