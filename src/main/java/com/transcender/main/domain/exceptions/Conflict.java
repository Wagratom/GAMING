package com.transcender.main.domain.exceptions;

public class Conflict extends RuntimeException {
    public Conflict(String err) {
        super(err);
    }
}
