package com.transcender.main.domain.valueobject;

public record PlayerMoveDto(
        String roomID,  // id da sala
        boolean isLeft, // se o jogador é o da esquerda
        boolean isUp    // se está movendo pra cima (true) ou para baixo (false)
) {}
