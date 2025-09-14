package com.transcender.main.adapters.in.controller.dto.responses;

import com.transcender.main.domain.entity.UserCore;
import lombok.Getter;

@Getter
public class ProfileResponse extends UserResponse {
    private final MatchesResponse matches;

    public ProfileResponse(UserCore user) {
        super(user);
        this.matches = new MatchesResponse(user);
    }
}
