package com.transcender.main.adapters.in.controller.dto.responses;

import com.transcender.main.domain.entity.ChatCore;
import com.transcender.main.domain.entity.ChatUserCore;
import com.transcender.main.domain.enuns.MessageType;
import lombok.Getter;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
public class ChatResponse {
    private final Long id;
    private final String name;
    private final List<messageResponseDto> messages;
    private final UserResponse owner;
    private final String type;
    private final Instant criadoEm;
    private final Set<UserResponse> adms;
    private final Set<UserResponse> members;
    private final Set<UserResponse> banned;
    private final Set<UserResponse> kicked;
    private final Set<UserResponse> mutted;

    private record messageResponseDto(
            Long id,
            String content,
            MessageType type,
            UserResponse sender,
            Instant date
    ) {
    }

    public ChatResponse(ChatCore chatCore) {
        id = chatCore.getId();
        name = chatCore.getChatName();
        type = chatCore.getType().name();
        criadoEm = chatCore.getCriadoEm();
        owner = new UserResponse(chatCore.getChatOwner());

        adms = chatCore.getAdms();
        members = chatCore.getMembers();
        banned = chatCore.getBanned();
        kicked = chatCore.getKicked();
        mutted = chatCore.getMutted();

        messages = chatCore.getMessagens() == null
                ? List.of()
                : chatCore.getMessagens()
                .stream().map((message) -> {
                    return new messageResponseDto(
                            message.getId(),
                            message.getConteudo(),
                            message.getTipo(),
                            new UserResponse(message.getSender()),
                            message.getAtualizadoEm() != null ? message.getAtualizadoEm() : message.getCriadoEm()
                    );
                }).collect(Collectors.toList());

    }
}
