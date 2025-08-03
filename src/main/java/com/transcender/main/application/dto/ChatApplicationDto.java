package com.transcender.main.application.dto;

public record ChatApplicationDto(
        Long id,
        String chatName,
        String descricao,
        String type,
        Long chatOwner
) {
}
