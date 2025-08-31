package com.transcender.main.adapters.out.jpa.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor        // cria construtor vazio
@AllArgsConstructor       // cria construtor com todos os campos (incluindo collections)
@Table(name = "usuarios")
public class UserCoreJpa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true, unique = true, length = 50)
    private String email;

    @Column(name = "senha_hash", nullable = false, length = 512)
    private String senhaHash;

    @Column(nullable = true, unique = true, length = 15)
    private String nickname;

    @Column(length = 20)
    private String telefone;

    @Column(name = "online", nullable = false)
    private Boolean online;

    @Column(name = "ative", nullable = true)
    private Boolean ative;

    @OneToMany(mappedBy = "owner")
    private List<ChatCoreJpa> chatsCriados;

    @OneToMany(mappedBy = "usuario")
    private List<ChatUserCoreJpa> chatsParticipando;

    @OneToMany(mappedBy = "usuario1", fetch = FetchType.LAZY)
    private List<FriendCoreJpa> solicitadas;

    @OneToMany(mappedBy = "usuario2", fetch = FetchType.LAZY)
    private List<FriendCoreJpa> recebidas;

    @Column(name = "criado_em", nullable = false)
    private Instant criadoEm = Instant.now();

    @Column(name = "atualizado_em", nullable = false)
    private Instant atualizadoEm = Instant.now();
}
