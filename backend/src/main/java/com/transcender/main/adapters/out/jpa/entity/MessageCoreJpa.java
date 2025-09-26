package com.transcender.main.adapters.out.jpa.entity;

import com.transcender.main.domain.enuns.MessageType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
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
    @JoinColumn(name = "sender_id", nullable = false)
    private UserCoreJpa sender;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String conteudo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MessageType tipo;

    @Column(name = "criado_em", nullable = false)
    private Instant criadoEm = Instant.now();

    @Column(name = "atualizado_em", nullable = false)
    private Instant atualizadoEm = null;

    @Column(nullable = false)
    private boolean editado = false;

    @Column(nullable = false)
    private boolean deletado = false;

    public MessageCoreJpa(ChatCoreJpa chat, UserCoreJpa sender, String content, MessageType tipo,
                          boolean editado, boolean deletado) {

        this.chat = chat;
        this.tipo = tipo;
        this.sender = sender;
        this.conteudo = content;
        this.deletado = deletado;
        this.editado = editado;
        this.conteudo = content;
    }
}
