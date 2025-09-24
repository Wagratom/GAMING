package com.transcender.main.adapters.in.controller.dto.responses;

import com.transcender.main.domain.entity.ChatCore;
import com.transcender.main.domain.entity.ChatUserCore;
import com.transcender.main.domain.entity.MessageCore;
import lombok.Getter;

import java.time.Instant;
import java.util.List;
import java.util.Set;

@Getter
public class ChatResponse {
    private final Long id;
    private final String name;
    private final List<MessageCore> messages;
    private final UserResponse owner;
    private final String type;
    private final Instant criadoEm;
    private final Set<ChatUserCore> adms;
    private final Set<ChatUserCore> members;
    private final Set<ChatUserCore> banned;
    private final Set<ChatUserCore> kicked;
    private final Set<ChatUserCore> mutted;

    public ChatResponse(ChatCore chatCore) {
        id = chatCore.getId();
        name = chatCore.getChatName();
        type = chatCore.getType().name();
        criadoEm = chatCore.getCriadoEm();
        messages = chatCore.getMessagens() == null ? List.of() : chatCore.getMessagens();
        owner = new UserResponse(chatCore.getChatOwner());

        adms = chatCore.getAdms();
        members = chatCore.getMembers();
        banned = chatCore.getBanned();
        kicked = chatCore.getKicked();
        mutted = chatCore.getMutted();
    }
}
