package com.transcender.main.domain.exceptions;

public class Unauthorized extends RuntimeException {
    public Unauthorized(String reason) {
        super(String.format("Acesso negado: %s", reason));
    }
}