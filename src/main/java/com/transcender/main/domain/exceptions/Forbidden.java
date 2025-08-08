package com.transcender.main.domain.exceptions;

public class Forbidden extends RuntimeException{
    public Forbidden(String err) {
        super(String.format(err));
    }
}
