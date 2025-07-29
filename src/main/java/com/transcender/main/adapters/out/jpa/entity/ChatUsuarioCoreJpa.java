package com.transcender.main.adapters.out.jpa.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "chat_usuarios")
public class ChatUsuarioCoreJpa {

    @EmbeddedId
    private ChatUsuarioIdJpa id;

    @Column(nullable = false)
    private String status;

    @Column(name = "entrou_em", nullable = false)
    private Instant entrouEm;

    @Column(name = "saiu_em")
    private Instant saiuEm;

    public ChatUsuarioCoreJpa() {}

    public ChatUsuarioCoreJpa(ChatUsuarioIdJpa id, String status, Instant entrouEm, Instant saiuEm) {
        this.id = id;
        this.status = status;
        this.entrouEm = entrouEm;
        this.saiuEm = saiuEm;
    }

    public ChatUsuarioIdJpa getId() { return id; }
    public void setId(ChatUsuarioIdJpa id) { this.id = id; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getEntrouEm() { return entrouEm; }
    public void setEntrouEm(Instant entrouEm) { this.entrouEm = entrouEm; }

    public Instant getSaiuEm() { return saiuEm; }
    public void setSaiuEm(Instant saiuEm) { this.saiuEm = saiuEm; }
}

