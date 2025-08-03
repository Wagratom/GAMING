package com.transcender.main.adapters.out.jpa.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "usuarios")
public class UserCoreJpa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String email;

    @Column(name = "senha_hash", nullable = false, length = 512)
    private String senhaHash;

    @Column(nullable = false, length = 15)
    private String nickname;

    @Column(length = 20)
    private String telefone;

    private Boolean online;

    private Boolean ative;

    @Column(name = "criado_em", nullable = false)
    private Instant criadoEm = Instant.now();

    @Column(name = "atualizado_em", nullable = false)
    private Instant atualizadoEm = Instant.now();

    @OneToMany(mappedBy = "onwer")
    private List<ChatCoreJpa> chatsCriados;

    @OneToMany(mappedBy = "usuario")
    private List<ChatUserCoreJpa> chatsParticipando;
}
