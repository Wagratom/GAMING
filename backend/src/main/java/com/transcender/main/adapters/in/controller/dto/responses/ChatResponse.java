package com.transcender.main.adapters.in.controller.dto.responses;

import com.transcender.main.domain.entity.ChatCore;
import com.transcender.main.domain.entity.ChatUserCore;
import com.transcender.main.domain.entity.MessageCore;
import lombok.Getter;

import java.time.Instant;
import java.util.List;

@Getter
public class ChatResponse {
    private final Long id;
    private final String name;
    private final List<MessageCore> messages;
    private final UserResponse owner;
    private final String type;
    private final Instant criadoEm;
    private final List<ChatUserCore> members;

    public ChatResponse(ChatCore chatCore) {
        id = chatCore.getId();
        name = chatCore.getChatName();
        type = chatCore.getType().name();
        criadoEm = chatCore.getCriadoEm();
        messages = chatCore.getMessagens() == null ? List.of() : chatCore.getMessagens();
        owner = new UserResponse(chatCore.getChatOwner());
        members = chatCore.getUsuarios();
    }
}
