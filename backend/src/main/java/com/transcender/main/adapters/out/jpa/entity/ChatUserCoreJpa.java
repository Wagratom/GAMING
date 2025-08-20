package com.transcender.main.adapters.out.jpa.entity;

import com.transcender.main.domain.enuns.PermitionChat;
import com.transcender.main.domain.enuns.StatusChat;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Setter
@Getter
@Entity
@Table(name = "chat_usuarios")
@IdClass(ChatUserIdJpa.class)
public class ChatUserCoreJpa {

    @Id
    @ManyToOne
    @JoinColumn(name = "chat_id", nullable = false)
    private ChatCoreJpa chat;

    @Id
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private UserCoreJpa usuario;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_chat", nullable = false, length = 10)
    private StatusChat statusChat;

    @Enumerated(EnumType.STRING)
    @Column(name = "permition_chat", nullable = false, length = 10)
    private PermitionChat permitionChat;

    @Column(name = "entrou_em", nullable = false)
    private Instant entrouEm = Instant.now();

    @Column(name = "saiu_em")
    private Instant saiuEm;
}