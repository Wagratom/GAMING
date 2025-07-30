package com.transcender.main.domain.Entity;

public record PartidaCore(
        Long id,
        Long usuario1Id,
        Long usuario2Id,
        int scoreUsuario1,
        int scoreUsuario2,
        String mapa,
        java.time.Instant criadoEm,
        java.time.Instant atualizadoEm
) {}
