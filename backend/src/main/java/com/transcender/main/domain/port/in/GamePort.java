package com.transcender.main.domain.port.in;

import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.valueobject.PlayerMoveDto;

public interface GamePort {
    void addToQueue(Long playerId, String typeMode);
    void createRoom(String roomId, UserCore player1, UserCore player2, String mode);
    void handleMove(PlayerMoveDto move);
    void acceptInvite(Long invitedId, String roomId);
    String createInviteRoom(Long inviterId, Long invitedId);
}
