package com.transcender.main.core.Entity;

public record ChatUsuarioCore(
        Long chatId,
        Long usuarioId,
        String status,
        java.time.Instant entrouEm,
        java.time.Instant saiuEm // pode ser null
) {}
