package com.transcender.main.adapters.out.jpa.entity;

import com.transcender.main.domain.enuns.AmizadeStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "amigos", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"usuario_1_id", "usuario_2_id"})
})
public class AmizadeJpa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_1_id")
    private UserCoreJpa usuario1; // Quem iniciou

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_2_id")
    private UserCoreJpa usuario2; // Quem recebeu

    @Column(nullable = false, length = 50)
    private AmizadeStatus status;

    @Column(name = "criado_em", nullable = false)
    private Instant criadoEm = Instant.now();

    @Column(name = "atualizado_em", nullable = false)
    private Instant atualizadoEm = Instant.now();
}
