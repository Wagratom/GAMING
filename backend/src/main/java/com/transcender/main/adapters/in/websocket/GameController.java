package com.transcender.main.adapters.in.websocket;

import com.transcender.main.application.GameApplicationService;
import com.transcender.main.domain.valueobject.PlayerMoveDto;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class GameController {

    private final GameApplicationService gameService;

    public record CreateRoomMessage(Long playerId, String typeMode) {
    }

    public record InviteMessage(Long inviterId, Long invitedId) {
    }

    public record AcceptInviteMessage(String roomId, Long invitedId) {
    }

    // ==========================================
    // MOVIMENTAÇÃO DO JOGADOR
    // ==========================================
    @MessageMapping("/game/move") // /app/game/move
    public void handlePlayerMove(@Payload PlayerMoveDto move) {
        gameService.handleMove(move);
    }

    // ==========================================
    // MODO NORMAL (FILA AUTOMÁTICA)
    // ==========================================
    @MessageMapping("/game/addPlayer")
    public void createRoom(@Payload CreateRoomMessage createRoomMessage) {
        gameService.addToQueue(createRoomMessage.playerId, createRoomMessage.typeMode);
    }

    // ==========================================
    // MODO CONVITE (PLAYER A → PLAYER B)
    // ==========================================
    @MessageMapping("/game/invite")
    public void sendInvite(@Payload InviteMessage invite) {
        String roomId = gameService.createInviteRoom(invite.inviterId(), invite.invitedId());
        if (roomId == null) {
            gameService.notifyError(invite.inviterId(),
                    "Não foi possível criar o convite. Verifique se você já está em uma partida ou fila. As filas e partidas expiram entre 1 e 5 minutos");
        }
    }

    // ==========================================
    // ACEITAR CONVITE (PLAYER B ACEITA)
    // ==========================================
    @MessageMapping("/game/invite/accept")
    public void acceptInvite(@Payload AcceptInviteMessage accept) {
        gameService.acceptInvite(accept.invitedId(), accept.roomId());
    }
}
