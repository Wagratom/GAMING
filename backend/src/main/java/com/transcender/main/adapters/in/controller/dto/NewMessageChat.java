package com.transcender.main.adapters.in.controller.dto;

import jakarta.validation.constraints.NotBlank;

public record NewMessageChat(String senderId, @NotBlank String content) {}
