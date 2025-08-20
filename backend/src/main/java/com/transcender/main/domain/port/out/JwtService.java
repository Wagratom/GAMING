package com.transcender.main.domain.port.out;

import java.util.Map;

public interface JwtService {
        String generateToken(Map<String, Object> jsonPayload);
        Map<String, Object> validateTokenAndGetClaims(String token);
}
