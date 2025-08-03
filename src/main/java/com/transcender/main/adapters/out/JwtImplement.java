package com.transcender.main.adapters.out;

import com.transcender.main.domain.port.out.JwtGeneratorPort;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;
import java.util.Map;

public class JwtImplement implements JwtGeneratorPort {

    private final Key secretKey;
    private final long expirationMillis;

    public JwtImplement(String secret, long expirationMillis) {
        // Chave secreta para assinar o JWT (deve ter pelo menos 256 bits para HS256)
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationMillis = expirationMillis;
    }

    // Gera um JWT com as claims passadas (jsonPayload) e expiração
    public String generateToken(Map<String, Object> jsonPayload) {
        long nowMillis = System.currentTimeMillis();
        Date now = new Date(nowMillis);
        Date exp = new Date(nowMillis + expirationMillis);

        return Jwts.builder()
                .setClaims(jsonPayload)    // Passa o JSON como claims
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // Valida o token e retorna as claims (json) se válido, ou lança exceção se inválido
    public Map<String, Object> validateTokenAndGetClaims(String token) throws JwtException {
        Jws<Claims> jws = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token);

        return jws.getBody();
    }
}
