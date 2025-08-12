package com.transcender.main.adapters.in.controller.dto;

import jakarta.validation.constraints.NotBlank;

public record AddUserDto(@NotBlank(message = "friendId não pode ser vazio") String friendId) {
}
