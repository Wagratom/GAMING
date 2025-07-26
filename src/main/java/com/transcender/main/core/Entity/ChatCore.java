package com.transcender.main.core.Entity;

public record ChatCore(
        Long id,
        String chatName,
        String descricao,
        java.time.Instant criadoEm,
        java.time.Instant atualizadoEm
) {}
