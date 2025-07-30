package com.transcender.main.domain.exceptions;

public class ChatArgumentInvalid extends RuntimeException {
    public ChatArgumentInvalid(String message) {
        super(String.format("Argumento invalido para o chat: %s", message));
    }
}
