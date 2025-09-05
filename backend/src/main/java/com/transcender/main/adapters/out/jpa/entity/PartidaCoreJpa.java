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
public class PartidaCoreJpa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Jogador 1
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_1", nullable = false)
    private UserCoreJpa usuario1;

    // Jogador 2
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_2", nullable = false)
    private UserCoreJpa usuario2;

    private Integer scoreUsuario1;
    private Integer scoreUsuario2;

    // Quem venceu (null = empate)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vencedor")
    private UserCoreJpa vencedor;

    private String mapa;

    @Column(name = "criado_em", nullable = false)
    private Instant criadoEm = Instant.now();

    @Column(name = "atualizado_em", nullable = false)
    private Instant atualizadoEm = Instant.now();
}
