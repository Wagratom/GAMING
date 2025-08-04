package com.transcender.main.domain.entity;

public record ChatUserCore(
        Long chatId,
        Long usuarioId,
        String statusChat,
        String permitionChat,
        java.time.Instant entrouEm,
        java.time.Instant saiuEm // pode ser null
) {}
