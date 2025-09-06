package com.transcender.main.adapters.in.controller.dto;

import com.transcender.main.domain.enuns.ChatType;
import jakarta.validation.constraints.NotBlank;

public record ChatDtoCreate(
        @NotBlank(message = "O nome do chat não pode ser vazio ou nulo.")
        String chatName,

        String descricao,

        @NotBlank(message = "O tipo do chat não pode ser vazio ou nulo.")
        ChatType type,

        @NotBlank(message = "O id do proprietário não pode ser vazio ou nulo.")
        Long chatOwner
) {}
