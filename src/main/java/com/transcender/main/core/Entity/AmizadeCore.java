package com.transcender.main.core.Entity;

public record AmizadeCore(
        Long usuario1Id,
        Long usuario2Id,
        String status,
        java.time.Instant criadoEm,
        java.time.Instant atualizadoEm
) {}
