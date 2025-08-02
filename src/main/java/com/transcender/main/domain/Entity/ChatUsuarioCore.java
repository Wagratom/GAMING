package com.transcender.main.domain.Entity;

public record ChatUsuarioCore(
        Long chatId,
        Long usuarioId,
        String statusChat,
        String permitionChat,
        java.time.Instant entrouEm,
        java.time.Instant saiuEm // pode ser null
) {}
