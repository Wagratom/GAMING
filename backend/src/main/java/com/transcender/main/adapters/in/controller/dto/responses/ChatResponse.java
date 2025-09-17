package com.transcender.main.adapters.in.controller.dto.responses;

import com.transcender.main.domain.entity.ChatCore;

import java.time.Instant;

public class ChatResponse {
    private Long id;
    private String chatName;
    private String type;
    private Instant criadoEm;

    public ChatResponse(ChatCore chatCore) {
        id = chatCore.getId();
        chatName = chatCore.getChatName();
        type = chatCore.getType().name();
        criadoEm = chatCore.getCriadoEm();
    }
}
