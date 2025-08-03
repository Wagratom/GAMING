package com.transcender.main.domain.port.out;

import com.transcender.main.domain.Entity.UserCore;

public interface TokenGeneratorPort {
        String generateToken(UserCore user);
}

