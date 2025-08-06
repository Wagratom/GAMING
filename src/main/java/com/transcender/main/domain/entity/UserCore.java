package com.transcender.main.domain.entity;

import com.transcender.main.domain.exceptions.UsuarioArgumentInvalid;

import java.time.Instant;
import java.util.Optional;

public class UserCore {
    private Long id;
    private String email;
    private String senha;
    private String nickname;
    private String telefone;
    private boolean online;
    private boolean ative;
    private Instant criadoEm;
    private Instant atualizadoEm;

    public UserCore() {}

    public UserCore(Long id, String email, String senha, String nickname, String telefone,
             boolean online, Instant criadoEm, Instant atualizadoEm) {
        if (id == null || id <= 0) throw new UsuarioArgumentInvalid("Id invalido");
        this.id = id;
        this.email = email;
        this.senha = senha;
        this.nickname = nickname;
        this.telefone = telefone;
        this.online = online;

        this.criadoEm = criadoEm;
        this.atualizadoEm = atualizadoEm;
    }

    public UserCore(String email, String senha, String nickname, String telefone, Optional<Long> id) {
        id.ifPresent(value -> this.id = value);
        this.email = email;
        this.senha = senha;
        this.nickname = nickname;
        this.telefone = telefone;
        this.online = false;
        this.criadoEm = Instant.now();
        this.atualizadoEm = Instant.now();
    }

    public void validateUpdateUser(Long solicitanteId) {
        this.validateCreateUser();
        if (solicitanteId == null || solicitanteId <= 0) throw new UsuarioArgumentInvalid("Id inválido: deve ser positivo");
        this.criadoEm = null;
    }

    public void validateCreateUser() {
        boolean emailVazio = email == null || email.trim().isEmpty();
        boolean nicknameVazio = nickname == null || nickname.trim().isEmpty();

        if (emailVazio && nicknameVazio) {
            throw new UsuarioArgumentInvalid("Email ou nickname devem ser especificados");
        }

        if (nickname != null && nickname.length() > 15) {
            throw new UsuarioArgumentInvalid(String.format("Nickname: inválido '%s' maior que 15 caracteres", nickname));
        }

        if (email != null && email.length() > 50) {
            throw new UsuarioArgumentInvalid("Email inválido: deve ter no máximo 100 caracteres");
        }

        if (senha == null || senha.trim().isEmpty()) {
            throw new UsuarioArgumentInvalid("Senha inválida");
        }
    }

    // Getters
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getSenha() { return senha; }
    public String getNickname() { return nickname; }
    public String getTelefone() { return telefone; }
    public String getIdf() { return (email != null && !email.trim().isEmpty()) ? email : nickname; }
    public boolean getOnline() { return online; }
    public boolean getAtive() { return ative; }
    public Instant getCriadoEm() { return criadoEm; }
    public Instant getAtualizadoEm() { return atualizadoEm; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setEmail(String email) { this.email = email; }
    public void setSenha(String senha) { this.senha = senha; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public void setOnline(boolean online) { this.online = online; }
    public void setAtive(boolean ative) { this.ative = ative; }
    public void setCriadoEm(Instant criadoEm) { this.criadoEm = criadoEm; }
    public void setAtualizadoEm(Instant atualizadoEm) { this.atualizadoEm = atualizadoEm; }
}
