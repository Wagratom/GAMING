package com.transcender.main.application.dto;

import java.util.Optional;

public record UserApplicationDto(
        Optional<String> nickname,
        Optional<String> email,
        String senha) {
};
