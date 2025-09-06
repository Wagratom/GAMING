package com.transcender.main.adapters.in.websocket;

import com.transcender.main.application.GameApplicationService;
import com.transcender.main.domain.valueobject.PlayerMove;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class GameController {
    private final GameApplicationService gameService;
    public record CreateRoomMessage(String roomId, Long playerId1, Long playerId2) { }


    @MessageMapping("/game/move") // Prefixo /app/game/move
    public void handlePlayerMove(@Payload PlayerMove move) {
        gameService.handleMove(move);
    }

    /**
     * Cria nova sala de Pong
     *
     * @param createRoomMessage deve conter roomId e IDs dos dois jogadores
     */
    @MessageMapping("/game/create")
    public void createRoom(@Payload CreateRoomMessage createRoomMessage) {
        gameService.CreateRoom(
                createRoomMessage.roomId(),
                createRoomMessage.playerId1(),
                createRoomMessage.playerId2()
        );
    }
}
