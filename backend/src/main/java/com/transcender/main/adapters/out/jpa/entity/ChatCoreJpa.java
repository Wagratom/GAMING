package com.transcender.main.adapters.out.jpa.entity;

import com.transcender.main.domain.enuns.ChatType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "chat")
@RequiredArgsConstructor
@AllArgsConstructor
public class ChatCoreJpa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "chatname", length = 20)
    private String chatName;

    @ManyToOne
    @JoinColumn(name = "owner")
    private UserCoreJpa owner;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private ChatType type;

    @Column(columnDefinition = "text")
    private String descricao;

    @OneToMany(mappedBy = "chat", fetch = FetchType.LAZY)
    @OrderBy("atualizadoEm ASC")
    private List<MessageCoreJpa> mensagens;

    @OneToMany(mappedBy = "chat")
    private List<ChatUserCoreJpa> usuarios;

    @Column(name = "criado_em", nullable = false)
    private Instant criadoEm = Instant.now();

    @Column(name = "atualizado_em", nullable = false)
    private Instant atualizadoEm = Instant.now();

    public static ChatCoreJpa newPrivateChat() {
        ChatCoreJpa chat = new ChatCoreJpa();
        chat.setType(ChatType.PRIVATE);
        chat.setCriadoEm(Instant.now());
        chat.setAtualizadoEm(Instant.now());
        return chat;
    }
}
