package com.transcender.main.adapters.out.jpa.entity;

import com.transcender.main.domain.enuns.ChatType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "chat")
public class ChatCoreJpa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "chatname", nullable = false, length = 20)
    private String chatName;

    @ManyToOne
    @JoinColumn(name = "onwer", nullable = false)
    private UsuarioCoreJpa onwer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private ChatType type; //tenho que criar uma entidade no banco de dados aqui ou apenas criar um enum no domain?

    @Column(columnDefinition = "text")
    private String descricao;

    @Column(name = "criado_em", nullable = false)
    private Instant criadoEm = Instant.now();

    @Column(name = "atualizado_em", nullable = false)
    private Instant atualizadoEm = Instant.now();

    @OneToMany(mappedBy = "chat")
    private List<ChatUsuarioCoreJpa> usuarios;

}
