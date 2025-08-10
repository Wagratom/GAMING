package com.transcender.main.adapters.out.jpa.entity;

import com.transcender.main.domain.enuns.FriendStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "amigos", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"usuario1_id", "usuario2_id"})
})
public class FriendCoreJpa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario1_id")
    private UserCoreJpa usuario1; // Quem iniciou

    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario2_id")
    private UserCoreJpa usuario2; // Quem recebeu

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FriendStatus status;

    @Column(name = "criado_em", nullable = false)
    private Instant criadoEm = Instant.now();

    @Column(name = "atualizado_em", nullable = false)
    private Instant atualizadoEm = Instant.now();

    public FriendCoreJpa(UserCoreJpa usuario1, UserCoreJpa usuario2, FriendStatus status) {
        this.usuario1 = usuario1;
        this.usuario2 = usuario2;
        this.status = status;
        this.atualizadoEm = Instant.now();
        this.criadoEm = Instant.now();
    }
}
