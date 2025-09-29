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
    private final List<UserResponse> adms;
    private final List<UserResponse> members;
    private final List<UserResponse> banned;
    private final List<UserResponse> kicked;
    private final List<UserResponse> mutted;

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

        adms = chatCore.getAdms().stream().map((adm) -> new UserResponse(adm.user())).collect(Collectors.toList());
        members = chatCore.getMembers().stream().map((adm) -> new UserResponse(adm.user())).collect(Collectors.toList());
        banned = chatCore.getBanned().stream().map((adm) -> new UserResponse(adm.user())).collect(Collectors.toList());
        kicked = chatCore.getKicked().stream().map((adm) -> new UserResponse(adm.user())).collect(Collectors.toList());
        mutted = chatCore.getMutted().stream().map((adm) -> new UserResponse(adm.user())).collect(Collectors.toList());

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
