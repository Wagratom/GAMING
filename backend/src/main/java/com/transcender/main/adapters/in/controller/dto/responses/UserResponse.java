package com.transcender.main.adapters.in.controller.dto.responses;

import com.transcender.main.domain.entity.UserCore;
import lombok.Getter;

import java.time.Instant;

@Getter
public class UserResponse {

    private final Long id;
    private final String email;
    private final String nickname;
    private final String avatar;
    private final boolean online;
    private final Instant criadoEm;

    public UserResponse(UserCore user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.nickname = user.getNickname();
        this.avatar = user.getAvatar();
        this.online = user.getOnline();
        this.criadoEm = user.getCriadoEm();
    }
}
