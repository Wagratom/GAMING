package com.transcender.main.domain.exceptions;

public class UsuarioArgumentInvalid extends RuntimeException {
    public UsuarioArgumentInvalid(String message) {
        super(String.format("Argumento invalido user: %s", message));
    }
}
