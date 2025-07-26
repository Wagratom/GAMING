package com.transcender.main.core.exceptions;

public class Unauthorized extends RuntimeException {
    public Unauthorized(String reason) {
        super(String.format("Acesso negado: %s", reason));
    }
}