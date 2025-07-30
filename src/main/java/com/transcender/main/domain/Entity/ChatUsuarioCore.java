package com.transcender.main.domain.Entity;

public record ChatUsuarioCore(
        Long chatId,
        Long usuarioId,
        String status,
        java.time.Instant entrouEm,
        java.time.Instant saiuEm // pode ser null
) {}
