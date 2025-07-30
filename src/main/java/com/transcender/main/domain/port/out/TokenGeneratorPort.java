package com.transcender.main.domain.port.out;

import com.transcender.main.domain.Entity.UsuarioCore;

public interface TokenGeneratorPort {
        String generateToken(UsuarioCore user);
}

