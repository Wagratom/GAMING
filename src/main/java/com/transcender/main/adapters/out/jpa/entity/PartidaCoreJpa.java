package com.transcender.main.adapters.out.jpa.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "partidas")
public class PartidaCoreJpa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario1_id", nullable = false)
    private Long usuario1Id;

    @Column(name = "usuario2_id", nullable = false)
    private Long usuario2Id;

    @Column(name = "score_usuario1", nullable = false)
    private int scoreUsuario1;

    @Column(name = "score_usuario2", nullable = false)
    private int scoreUsuario2;

    @Column(nullable = false)
    private String mapa;

    @CreationTimestamp
    @Column(name = "criado_em", updatable = false)
    private Instant criadoEm;

    @UpdateTimestamp
    @Column(name = "atualizado_em")
    private Instant atualizadoEm;

    public PartidaCoreJpa() {}

    public PartidaCoreJpa(Long id, Long usuario1Id, Long usuario2Id, int scoreUsuario1, int scoreUsuario2, String mapa, Instant criadoEm, Instant atualizadoEm) {
        this.id = id;
        this.usuario1Id = usuario1Id;
        this.usuario2Id = usuario2Id;
        this.scoreUsuario1 = scoreUsuario1;
        this.scoreUsuario2 = scoreUsuario2;
        this.mapa = mapa;
        this.criadoEm = criadoEm;
        this.atualizadoEm = atualizadoEm;
    }

    // Getters
    public Long getId() { return id; }
    public Long getUsuario1Id() { return usuario1Id; }
    public Long getUsuario2Id() { return usuario2Id; }
    public int getScoreUsuario1() { return scoreUsuario1; }
    public int getScoreUsuario2() { return scoreUsuario2; }
    public String getMapa() { return mapa; }
    public Instant getCriadoEm() { return criadoEm; }
    public Instant getAtualizadoEm() { return atualizadoEm; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setUsuario1Id(Long usuario1Id) { this.usuario1Id = usuario1Id; }
    public void setUsuario2Id(Long usuario2Id) { this.usuario2Id = usuario2Id; }
    public void setScoreUsuario1(int scoreUsuario1) { this.scoreUsuario1 = scoreUsuario1; }
    public void setScoreUsuario2(int scoreUsuario2) { this.scoreUsuario2 = scoreUsuario2; }
    public void setMapa(String mapa) { this.mapa = mapa; }
    public void setCriadoEm(Instant criadoEm) { this.criadoEm = criadoEm; }
    public void setAtualizadoEm(Instant atualizadoEm) { this.atualizadoEm = atualizadoEm; }
}
