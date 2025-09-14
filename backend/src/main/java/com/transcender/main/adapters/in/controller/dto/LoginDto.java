package com.transcender.main.adapters.in.controller.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Optional;

public record LoginDto (
        Optional<String> nickname,
        Optional<String> email,

        @NotBlank(message = "A senha não pode ser vazio ou nulo")
        String password
){};