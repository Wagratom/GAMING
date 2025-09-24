package com.transcender.main.adapters.out.jpa;

import com.transcender.main.adapters.out.jpa.entity.MatchCoreJpa;
import com.transcender.main.adapters.out.jpa.mapper.MapperToJpaEntity;
import com.transcender.main.adapters.out.jpa.repository.MatchRepository;
import com.transcender.main.adapters.out.jpa.repository.UserRepository;
import com.transcender.main.domain.entity.MatchCore;
import com.transcender.main.domain.exceptions.BadRequest;
import com.transcender.main.domain.port.out.MatchRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.Instant;

@Repository
@RequiredArgsConstructor
public class MatchRepositoryAdapter implements MatchRepositoryPort {
    @Autowired
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final MapperToJpaEntity mapperToJpaEntity;

    @Override
    public MatchCore createMatch(String mode, Long winnerId, Long loserId, Integer scoreWinner, Integer scoreLoser) {
        MatchCoreJpa newMatch = matchRepository.save(new MatchCoreJpa(
                null,
                userRepository.findById(winnerId).orElseThrow(() -> new BadRequest("usuario não existe")),
                userRepository.findById(loserId).orElseThrow(() -> new BadRequest("usuario não existe")),
                scoreWinner,
                scoreLoser,
                "Default",
                Instant.now(),
                Instant.now()
        ));
        return new MatchCore(
                newMatch.getId(),
                "Default",
                mapperToJpaEntity.toUserCore(newMatch.getWinner(), false, false),
                mapperToJpaEntity.toUserCore(newMatch.getLoser(), false, false),
                scoreWinner,
                scoreLoser,
                newMatch.getCriadoEm(),
                newMatch.getAtualizadoEm()
        );
    }
}
