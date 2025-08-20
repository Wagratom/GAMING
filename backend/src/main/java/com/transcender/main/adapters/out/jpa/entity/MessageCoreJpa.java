package com.transcender.main.adapters.out.jpa.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "mensagens")
public class MessageCoreJpa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relacionamento com o chat
    @ManyToOne
    @JoinColumn(name = "chat_id", nullable = false)
    private ChatCoreJpa chat;

    // Relacionamento com o usuário que enviou
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private UserCoreJpa sender;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String conteudo;

    @Column(nullable = false, length = 20)
    private String tipo = "TEXT"; // ou você pode usar enum igual ao ChatType

    @Column(name = "criado_em", nullable = false)
    private Instant criadoEm = Instant.now();

    @Column(name = "atualizado_em", nullable = false)
    private Instant atualizadoEm = Instant.now();

    @Column(nullable = false)
    private boolean editado = false;

    @Column(nullable = false)
    private boolean deletado = false;
}
