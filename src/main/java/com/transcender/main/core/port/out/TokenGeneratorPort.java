package com.transcender.main.core.port.out;

import com.transcender.main.core.Entity.UsuarioCore;

public interface TokenGeneratorPort {
        String generateToken(UsuarioCore user);
}

