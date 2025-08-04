package com.transcender.main.adapters.in.controller;

import com.transcender.main.adapters.in.controller.dto.LoginDto;
import com.transcender.main.adapters.in.controller.dto.UserDtoRegister;
import com.transcender.main.application.UserApplication;
import com.transcender.main.domain.entity.UserCore;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

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

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@Valid @RequestBody LoginDto body) {
        return ResponseEntity.ok().body(
                userApplication.login(body.nickname(), body.email(), body.senha())
        );
    }
}
