package com.transcender.main.adapters.out;

import com.transcender.main.domain.Entity.UsuarioCore;
import com.transcender.main.domain.port.out.TokenGeneratorPort;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Date;

@Component
public class TokenGeneratorImpl implements TokenGeneratorPort {
    @Value("${jwt.secret}")
    private String secret;

    @Override
    public String generateToken(UsuarioCore user) {
        return Jwts.builder()
                .setSubject(user.getId().toString())
                .claim("email", user.getEmail())
                .claim("nickname", user.getNickname())
                .setIssuedAt(new Date())
                .setExpiration(Date.from(Instant.now().plus(Duration.ofHours(4))))
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }
}
