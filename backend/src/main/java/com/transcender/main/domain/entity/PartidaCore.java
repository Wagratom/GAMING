package com.transcender.main.domain.entity;

import java.time.Instant;

public record PartidaCore(
        Long id,
        UserCore usuario1,      // Jogador 1
        UserCore usuario2,      // Jogador 2
        Integer scoreUsuario1,
        Integer scoreUsuario2,
        UserCore vencedor,      // Pode ser null em caso de empate
        String mapa,
        Instant criadoEm,
        Instant atualizadoEm
) {
}
