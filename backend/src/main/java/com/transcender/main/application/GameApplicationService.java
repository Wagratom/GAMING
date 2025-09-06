package com.transcender.main.application;

import com.transcender.main.domain.entity.PongGame;
import com.transcender.main.domain.valueobject.PlayerMove;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class GameApplicationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final Map<String, PongGame> games = new ConcurrentHashMap<>();

    public void CreateRoom(String roomId, Long playerId1, Long playerId2) {
        PongGame game = games.computeIfAbsent(roomId, r -> new PongGame(roomId));
        game.addPlayer(playerId1, playerId2);

        // Envia estado inicial para todos
        messagingTemplate.convertAndSend("/topic/game/" + roomId, game);
    }

    public void handleMove(PlayerMove move) {
        PongGame game = games.get(move.roomId());
        if (game != null) {
            game.movePlayer(move);
            messagingTemplate.convertAndSend("/topic/game/" + move.roomId(), game);
        }
    }

    // Loop para mover a bola (thread separada)
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
