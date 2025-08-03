package com.transcender.main.adapters.in.controller;

import com.transcender.main.adapters.in.controller.dto.LoginDto;
import com.transcender.main.application.UserApplication;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {
    final private UserApplication userApplication;

    @Autowired
    AuthController(UserApplication userApplication) {
        this.userApplication = userApplication;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginDto body) {
        return ResponseEntity.ok().body(
        userApplication.login(body.nickname(), body.email(), body.senha())
        );
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody LoginDto body) {
        return ResponseEntity.ok().body(
                userApplication.login(body.nickname(), body.email(), body.senha())
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@Valid @RequestBody LoginDto body) {
        return ResponseEntity.ok().body(
                userApplication.login(body.nickname(), body.email(), body.senha())
        );
    }
}
