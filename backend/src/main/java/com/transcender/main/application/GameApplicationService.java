package com.transcender.main.application;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GameApplicationService {

    private final SimpMessagingTemplate messagingTemplate;
    private final Map<String, PongGame> games = new ConcurrentHashMap<>();

    public GameService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void addPlayer(String roomId, String playerId) {
        PongGame game = games.computeIfAbsent(roomId, r -> new PongGame(roomId));
        game.addPlayer(playerId);

        // Envia estado inicial para todos
        messagingTemplate.convertAndSend("/topic/game/" + roomId, game);
    }

    public void handleMove(String roomId, PlayerMove move) {
        PongGame game = games.get(roomId);
        if (game != null) {
            game.movePlayer(move);
            messagingTemplate.convertAndSend("/topic/game/" + roomId, game);
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
