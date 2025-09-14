package com.transcender.main.domain.port.out;

import com.transcender.main.domain.entity.MatchCore;

import java.time.Instant;

public interface MatchRepositoryPort {
    MatchCore createMatch(
            String mode,
            Long winnerId,
            Long loserId,
            Integer scoreWinner,
            Integer scoreLoser
    );
}
