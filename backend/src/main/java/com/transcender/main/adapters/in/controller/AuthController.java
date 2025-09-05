package com.transcender.main.adapters.in.controller;

import com.transcender.main.adapters.in.controller.dto.LoginDto;
import com.transcender.main.adapters.in.controller.dto.UserDtoRegister;
import com.transcender.main.application.UserApplication;
import com.transcender.main.domain.entity.UserCore;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {
    final private UserApplication userApplication;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    AuthController(UserApplication userApplication, SimpMessagingTemplate messagingTemplate) {
        this.userApplication = userApplication;
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody LoginDto body) {
        String token = userApplication.login(body.nickname(), body.email(), body.password());
        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(true) // se usar HTTPS
                .path("/")
                .maxAge(Duration.ofHours(1))
                .sameSite("Strict")
                .build();

        messagingTemplate.convertAndSend("/topic/login", body.nickname());
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("token", token));

    }

    @PatchMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String jwt) {
        Long userId = userApplication.logout(jwt);
        messagingTemplate.convertAndSend("/topic/logout", userId);
        return ResponseEntity.ok().body("Success");
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody UserDtoRegister body) {
        UserCore user = userApplication.registerUser(
            new UserCore(
                body.getEmail(),
                body.getPassword(),
                body.getNickname(),
                body.getTelefone(),
                Optional.empty()
            )
        );
        return UserDtoRegister.toEntity(user);
    }
}
