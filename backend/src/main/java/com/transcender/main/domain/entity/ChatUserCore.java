package com.transcender.main.domain.entity;

import com.transcender.main.domain.enuns.PermitionChat;
import com.transcender.main.domain.enuns.StatusChat;

public record ChatUserCore(
        Long chatId,
        Long usuarioId,
        StatusChat statusChat,
        PermitionChat permitionChat,
        java.time.Instant entrouEm,
        java.time.Instant saiuEm // pode ser null
) {}
