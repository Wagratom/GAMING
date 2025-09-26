package com.transcender.main.adapters.out.jpa.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "partidas")
public class MatchCoreJpa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Vencedor
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "winner_id", nullable = false)
    private UserCoreJpa winner;

    // Perdedor
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loser_id", nullable = false)
    private UserCoreJpa loser;

    @Column(name = "winner_score", nullable = false)
    private Integer winnerScore;

    @Column(name = "loser_score", nullable = false)
    private Integer loserScore;

    @Column(name = "mapa", nullable = false)
    private String map;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private Instant criadoEm = Instant.now();

    @Column(name = "atualizado_em", nullable = true)
    private Instant atualizadoEm = null;
}
