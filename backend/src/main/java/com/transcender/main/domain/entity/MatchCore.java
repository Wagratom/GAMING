package com.transcender.main.domain.entity;

import java.time.Instant;

public record MatchCore(
        Long id,
        String map,
        UserCore winner,
        UserCore loser,
        Integer winnerScore,
        Integer loserScore,
        Instant criadoEm,
        Instant atualizadoEm
) {
}
