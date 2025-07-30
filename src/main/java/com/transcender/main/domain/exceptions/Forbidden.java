package com.transcender.main.domain.exceptions;

public class Forbidden extends RuntimeException{
    public Forbidden(String acao) {
        super(String.format("Usuario não tem permissao para %s", acao));
    }
}
