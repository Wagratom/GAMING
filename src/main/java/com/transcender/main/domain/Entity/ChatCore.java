package com.transcender.main.domain.Entity;

import com.transcender.main.domain.exceptions.UsuarioArgumentInvalid;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

public class ChatCore {

    private Long id;
    private String chatName;
    private Long chatOwner;
    private Set<Long> adms;
    private String type;
    private String descricao;
    private Instant criadoEm;
    private Instant atualizadoEm;

    // Construtor de criação com validações e inicialização de admins
    public ChatCore(String chatName, Long chatOwner, String type, String descricao, Set<Long> adms) {
        validate(chatName, descricao, type);
        if (chatOwner == null || chatOwner <= 0) {
            throw new UsuarioArgumentInvalid("Id do proprietário inválido");
        }

        this.chatName = chatName;
        this.chatOwner = chatOwner;
        this.type = type;
        this.descricao = descricao;
        this.criadoEm = Instant.now();
        this.atualizadoEm = Instant.now();
        this.adms = adms != null ? adms : new HashSet<>();
    }

    // Construtor restrito para reconstrução a partir do banco de dados
    ChatCore(Long id, String chatName, Long chatOwner, String type, String descricao,
             Instant criadoEm, Instant atualizadoEm, Set<Long> adms) {

        if (id == null || id <= 0) {
            throw new UsuarioArgumentInvalid("Id inválido");
        }

        this.id = id;
        this.chatName = chatName;
        this.chatOwner = chatOwner;
        this.type = type;
        this.descricao = descricao;
        this.criadoEm = criadoEm;
        this.atualizadoEm = atualizadoEm;
        this.adms = adms != null ? adms : new HashSet<>();
    }

    private void validate(String chatName, String descricao, String type) {
        if (chatName == null || chatName.trim().isEmpty()) {
            throw new UsuarioArgumentInvalid("Nome do chat não pode estar vazio");
        }
        if (chatName.length() > 10){
            throw new UsuarioArgumentInvalid("Nome do chat deve ter no máximo 10 caracteres");
        }

        if (descricao != null && descricao.length() > 100) {
            throw new UsuarioArgumentInvalid("Descrição deve ter no máximo 100 caracteres");
        }

        if (!"PUBLIC".equals(type) && !"PROTECT".equals(type) && !"PRIVATE".equals(type)) {
            throw new UsuarioArgumentInvalid("Tipo de chat inválido");
        }
    }

    public void update(String nome, String descricao, String type, Long solicitanteId) {
        hasPermissionUpdate(solicitanteId);
        validate(nome, descricao, type);
        this.chatName = nome;
        this.descricao = descricao;
        this.type = type;
        this.atualizadoEm = Instant.now();
    }

    private void hasPermissionUpdate(Long solicitanteId) {
        if (!verificarProprietario(solicitanteId) && !verificarAdm(solicitanteId)) {
            throw new UsuarioArgumentInvalid("Usuário não possui permissão para atualizar o chat");
        }
    }

    public boolean verificarProprietario(Long solicitanteId) {
        return chatOwner.equals(solicitanteId);
    }

    public boolean verificarAdm(Long solicitanteId) {
        return adms.contains(solicitanteId);
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getChatName() {
        return chatName;
    }

    public Long getChatOwner() {
        return chatOwner;
    }

    public Set<Long> getAdms() {
        return new HashSet<>(adms); // retornando cópia defensiva
    }

    public String getType() {
        return type;
    }

    public String getDescricao() {
        return descricao;
    }

    public Instant getCriadoEm() {
        return criadoEm;
    }

    public Instant getAtualizadoEm() {
        return atualizadoEm;
    }
}
