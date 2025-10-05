package com.transcender.main.adapters.in.controller.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record LoginDto(
        @JsonProperty("nickname") String nickname,
        @JsonProperty("email") String email,
        @JsonProperty("password") String password
) {}
