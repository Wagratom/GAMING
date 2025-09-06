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

    // Identificador único do usuário
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // E-mail do usuário (único, mas pode ser nulo)
    @Column(nullable = true, unique = true, length = 50)
    private String email;

    // Hash da senha (nunca armazenar senha em texto puro)
    @Column(name = "senha_hash", nullable = false, length = 512)
    private String senhaHash;

    // Apelido do usuário (único, mas pode ser nulo)
    @Column(nullable = true, unique = true, length = 15)
    private String nickname;

    // Telefone do usuário (opcional)
    @Column(length = 20)
    private String telefone;

    // Indica se o usuário está online
    @Column(name = "online", nullable = false)
    private Boolean online;

    // Indica se a conta está ativa
    @Column(name = "ative", nullable = true)
    private Boolean ative;

    // Chats que o usuário criou (relação com ChatCoreJpa.owner)
    @OneToMany(mappedBy = "owner")
    private List<ChatCoreJpa> chatsCriados;

    // Chats em que o usuário participa (relação com ChatUserCoreJpa.usuario)
    @OneToMany(mappedBy = "usuario")
    private List<ChatUserCoreJpa> chatsParticipando;

    // Amizades que o usuário solicitou (usuário é o usuario1)
    @OneToMany(mappedBy = "usuario1", fetch = FetchType.LAZY)
    private List<FriendCoreJpa> solicitadas;

    // Amizades recebidas pelo usuário (usuário é o usuario2)
    @OneToMany(mappedBy = "usuario2", fetch = FetchType.LAZY)
    private List<FriendCoreJpa> recebidas;

    // Partidas em que o usuário foi registrado como "usuario2"
    @OneToMany(mappedBy = "loser", fetch = FetchType.LAZY)
    private List<MatchCoreJpa> partidasPerdidas;

    // Partidas vencidas pelo usuário
    @OneToMany(mappedBy = "winner", fetch = FetchType.LAZY)
    private List<MatchCoreJpa> partidasVencidas;

    // Data de criação do perfil
    @Column(name = "criado_em", nullable = false)
    private Instant criadoEm = Instant.now();

    // Última vez que o perfil foi atualizado
    @Column(name = "atualizado_em", nullable = false)
    private Instant atualizadoEm = Instant.now();

    public UserCoreJpa(
            Long id,
            String email,
            String senhaHash,
            String nickname,
            String telefone,
            Boolean online,
            Boolean ative,
            Instant criadoEm,
            Instant atualizadoEm
    ) {
        this.id = id;
        this.email = email;
        this.senhaHash = senhaHash;
        this.nickname = nickname;
        this.telefone = telefone;
        this.online = online;
        this.ative = ative;
        this.criadoEm = criadoEm;
        this.atualizadoEm = atualizadoEm;
    }

}
