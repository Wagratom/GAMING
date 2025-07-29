package com.transcender.main.adapters.out.jpa.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "usuarios")
public class UsuarioCoreJpa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Column(nullable = false, unique = true)
    private String nickname;

    @Column(length = 20)
    private String telefone;

    @Column(nullable = false)
    private boolean online;

    @CreationTimestamp
    @Column(name = "criado_em", updatable = false)
    private Instant criadoEm;

    @UpdateTimestamp
    @Column(name = "atualizado_em")
    private Instant atualizadoEm;

    public UsuarioCoreJpa() {}

    public UsuarioCoreJpa(Long id, String email, String senha, String nickname, String telefone,
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
    public boolean getOnline() { return online; }
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
