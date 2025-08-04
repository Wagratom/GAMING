package com.transcender.main.domain.exceptions;

public class InternalError extends RuntimeException {
    public InternalError() {
        super("Internal Error");
    }
}
