package com.transcender.main.core.Entity;

import java.time.Instant;

public class ChatCore {

    private Long id;
    private String chatName;
    private Long chatOwner;
    private String descricao;
    private Instant criadoEm;
    private Instant atualizadoEm;

    public ChatCore() {}

    public ChatCore(Long id, String chatName, Long chatOwner, String descricao, Instant criadoEm, Instant atualizadoEm) {
        this.id = id;
        this.chatName = chatName;
        this.chatOwner = chatOwner;
        this.descricao = descricao;
        this.criadoEm = criadoEm;
        this.atualizadoEm = atualizadoEm;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getChatName() {
        return chatName;
    }

    public void setChatName(String chatName) {
        this.chatName = chatName;
    }

    public Long getChatOwner() {
        return chatOwner;
    }

    public void setChatOwner(Long chatOwner) {
        this.chatOwner = chatOwner;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Instant getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(Instant criadoEm) {
        this.criadoEm = criadoEm;
    }

    public Instant getAtualizadoEm() {
        return atualizadoEm;
    }

    public void setAtualizadoEm(Instant atualizadoEm) {
        this.atualizadoEm = atualizadoEm;
    }
}
