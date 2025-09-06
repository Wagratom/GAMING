package com.transcender.main.application.dto;

import com.transcender.main.domain.entity.PartidaCore;
import lombok.Getter;

import java.time.Instant;
import java.util.List;

@Getter
public class ProfileResponse extends UserResponse {
    private record Winners(List<PartidaCore> partidas){}
    private record Loses(List<PartidaCore> partidas){}

    private record PartidasCoreMap(Winners winners, Loses loses){}

    private PartidasCoreMap partidas;
    public ProfileResponse(Long id, String email, String nickname, String avatar, boolean online,
                           Instant criadoEm, PartidasCoreMap partidas) {
        super(id, email, nickname, avatar, online, criadoEm);
        this.partidas = partidas;
    }
}
