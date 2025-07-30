package com.transcender.main.core.exceptions;

import com.transcender.main.application.ChatApplication;

public class ChatArgumentInvalid extends RuntimeException {
    public ChatArgumentInvalid(String message) {
        super(String.format("[Error] na validação do chat: %s", message));
    }
}
