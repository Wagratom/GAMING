package com.transcender.main.core.Entity;

import com.transcender.main.core.exceptions.ChatArgumentInvalid;

import java.time.Instant;

public class ChatCore {

    private Long id;
    private String chatName;
    private Long chatOwner;
    private String type;
    private String descricao;
    private Instant criadoEm;
    private Instant atualizadoEm;

    // Construtor de criação com validações
    public ChatCore(String chatName, Long chatOwner, String type, String descricao) {
        validate(chatName, descricao, type);
        this.chatName = chatName;
        this.chatOwner = chatOwner;
        this.type = type;
        this.descricao = descricao;
        this.criadoEm = Instant.now();
        this.atualizadoEm = Instant.now();
    }

    // Construtor restrito para reconstrução a partir do banco
    ChatCore(Long id, String chatName, Long chatOwner, String type, String descricao, Instant criadoEm, Instant atualizadoEm) {
        this.id = id;
        this.chatName = chatName;
        this.chatOwner = chatOwner;
        this.type = type;
        this.descricao = descricao;
        this.criadoEm = criadoEm;
        this.atualizadoEm = atualizadoEm;
    }

    private void validate(String chatName, String descricao, String type) {
        if (chatName == null || chatName.trim().isEmpty())
            throw new ChatArgumentInvalid("Nome do chat não pode estar vazio");
        if (chatName.length() > 10)
            throw new ChatArgumentInvalid("Nome do chat deve ter no máximo 10 caracteres");

        if (descricao != null && descricao.length() > 100)
            throw new ChatArgumentInvalid("Descrição deve ter no máximo 100 caracteres");

        if (!"PUBLIC".equals(type) && !"PROTECT".equals(type) && !"PRIVATE".equals(type))
            throw new ChatArgumentInvalid("Tipo de chat inválido");
    }

    public void update(String nome, String descricao, String type, Long solicitanteId) {
        verificarProprietario(solicitanteId);
        validate(nome, descricao, type);
        this.chatName = nome;
        this.descricao = descricao;
        this.type = type;
        this.atualizadoEm = Instant.now();
    }

    private void verificarProprietario(Long userId) {
        if (!this.chatOwner.equals(userId)) {
            throw new ChatArgumentInvalid("Somente o proprietário pode atualizar o chat.");
        }
    }

    // Getters
    public Long getId() { return id; }
    public String getChatName() { return chatName; }
    public Long getChatOwner() { return chatOwner; }
    public String getType() { return type; }
    public String getDescricao() { return descricao; }
    public Instant getCriadoEm() { return criadoEm; }
    public Instant getAtualizadoEm() { return atualizadoEm; }
}
