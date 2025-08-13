package com.transcender.main.application.dto;

import com.transcender.main.domain.enuns.ChatType;

public record ChatApplicationDto(
        Long id,
        String chatName,
        String descricao,
        ChatType type,
        Long chatOwner
) {
}
