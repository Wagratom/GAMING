package com.transcender.main.adapters.in.controller.dto;

import jakarta.validation.constraints.NotBlank;

public record UserDto(
        @NotBlank(message = "O nickname não pode ser vazio ou nulo")
        String nickname,

        @NotBlank(message = "A senha não pode ser vazia ou nula")
        String password,

        @NotBlank(message = "O email não pode ser vazio ou nulo")
        String email,

        String telefone // opcional, sem validação
) {}
