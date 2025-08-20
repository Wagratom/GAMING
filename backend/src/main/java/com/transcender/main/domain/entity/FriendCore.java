package com.transcender.main.domain.entity;

import com.transcender.main.domain.enuns.FriendStatus;

public record FriendCore(
        Long id,
        Long usuario1Id,
        Long usuario2Id,
        FriendStatus status,
        java.time.Instant criadoEm,
        java.time.Instant atualizadoEm
) {}