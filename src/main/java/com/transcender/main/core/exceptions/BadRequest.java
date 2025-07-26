package com.transcender.main.core.exceptions;

public class BadRequest extends RuntimeException {
    public BadRequest(String message) {
        super(String.format("Requisição inválida: %s", message));
    }
}

