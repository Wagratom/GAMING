package com.transcender.main.domain.port.out;

import com.transcender.main.domain.Entity.UserCore;
import io.jsonwebtoken.JwtException;

import java.util.Map;

public interface JwtGeneratorPort {
        String generateToken(Map<String, Object> jsonPayload);
        Map<String, Object> validateTokenAndGetClaims(String token);
}
