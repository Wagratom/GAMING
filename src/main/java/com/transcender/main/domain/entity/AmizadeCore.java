package com.transcender.main.domain.entity;

import com.transcender.main.domain.enuns.AmizadeStatus;

public record AmizadeCore(
        Long id,
        Long usuario1Id,
        Long usuario2Id,
        AmizadeStatus status,
        java.time.Instant criadoEm,
        java.time.Instant atualizadoEm
) {}