package com.transcender.main.adapters.in.controller.dto.responses;

import com.transcender.main.domain.entity.MatchCore;
import com.transcender.main.domain.entity.UserCore;
import lombok.Getter;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class MatchesResponse {
    @Getter
    public static class Match {
        private final Long id;
        private final String map;
        private final UserResponse winner;
        private final UserResponse loser;
        private final Integer winnerScore;
        private final Integer loserScore;
        private final Instant createdAt;

        public Match(MatchCore match) {
            this.id = match.id();
            this.map = match.map();
            this.winner = new UserResponse(match.winner());
            this.loser = new UserResponse(match.loser());
            this.winnerScore = match.winnerScore();
            this.loserScore = match.loserScore();
            this.createdAt = match.criadoEm();
        }
    }

    private final List<Match> wins;
    private final List<Match> losses;

    public MatchesResponse(UserCore user) {
        this.wins = user.getWinnersMatches()
                .stream()
                .map(Match::new)
                .collect(Collectors.toList());

        this.losses = user.getLosesMatches()
                .stream()
                .map(Match::new)
                .collect(Collectors.toList());
    }
}
