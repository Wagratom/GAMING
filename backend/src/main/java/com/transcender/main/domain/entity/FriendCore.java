package com.transcender.main.domain.entity;

import com.transcender.main.domain.enuns.FriendStatus;

public record FriendCore(
        Long id,
        UserCore sender,
        UserCore received,
        FriendStatus status,
        java.time.Instant criadoEm,
        java.time.Instant atualizadoEm
) {}