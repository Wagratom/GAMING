package com.transcender.main.core.exceptions;

public class Forbidden extends RuntimeException{
    public Forbidden(String acao) {
        super(String.format("Usuario não tem permissao para %s", acao));
    }
}
