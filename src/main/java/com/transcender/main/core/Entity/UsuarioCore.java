package com.transcender.main.core.Entity;

import java.time.Instant;

public class UsuarioCore {
    private Long id;
    private String email;
    private String senha;
    private String nickname;
    private String telefone;
    private boolean online;
    private Instant criadoEm;
    private Instant atualizadoEm;

    public UsuarioCore() {}

    public UsuarioCore(Long id, String email, String senha, String nickname, String telefone,
                       boolean online, Instant criadoEm, Instant atualizadoEm) {
        this.id = id;
        this.email = email;
        this.senha = senha;
        this.nickname = nickname;
        this.telefone = telefone;
        this.online = online;
        this.criadoEm = criadoEm;
        this.atualizadoEm = atualizadoEm;
    }

    // Getters
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getSenha() { return senha; }
    public String getNickname() { return nickname; }
    public String getTelefone() { return telefone; }
    public boolean isOnline() { return online; }
    public Instant getCriadoEm() { return criadoEm; }
    public Instant getAtualizadoEm() { return atualizadoEm; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setEmail(String email) { this.email = email; }
    public void setSenha(String senha) { this.senha = senha; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public void setOnline(boolean online) { this.online = online; }
    public void setCriadoEm(Instant criadoEm) { this.criadoEm = criadoEm; }
    public void setAtualizadoEm(Instant atualizadoEm) { this.atualizadoEm = atualizadoEm; }
}
