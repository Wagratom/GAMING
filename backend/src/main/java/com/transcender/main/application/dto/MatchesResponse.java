package com.transcender.main.application.dto;

import com.transcender.main.domain.entity.PartidaCore;

import java.util.List;

public class MatchesResponse {
    private record Winners(List<PartidaCore> partidas){}
    private record Loses(List<PartidaCore> partidas){}

    private record PartidasCoreMap(ProfileResponse.Winners winners, ProfileResponse.Loses loses){}

}
