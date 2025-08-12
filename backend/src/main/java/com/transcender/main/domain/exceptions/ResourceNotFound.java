package com.transcender.main.domain.exceptions;

public class ResourceNotFound extends RuntimeException {
    public ResourceNotFound(String resource, Long id) {
        super(String.format("Erro ao procurar o recurso '%s': ID %d não encontrado.", resource, id));
    }
}
