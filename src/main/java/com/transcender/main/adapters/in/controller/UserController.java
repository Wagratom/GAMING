package com.transcender.main.adapters.in.controller;

import com.transcender.main.adapters.in.controller.dto.UserDtoRegister;
import com.transcender.main.adapters.in.controller.dto.UserDtoUpdate;
import com.transcender.main.application.UserApplication;
import com.transcender.main.domain.Entity.UserCore;
import com.transcender.main.domain.port.in.UserPortIn;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.Option;
import java.util.Map;
import java.util.Optional;

@RestController
public class UserController {
    private final UserPortIn userApplication;

    public UserController(UserApplication userApplication) {
        this.userApplication = userApplication;
    }

    //POST -> /users
    @PostMapping
    public ResponseEntity<Map<String, Object>> registerUser(@Valid @RequestBody UserDtoRegister body) {
        UserCore user = userApplication.registerUser(new UserCore(
                body.getEmail(),
                body.getPassword(),
                body.getNickname(),
                body.getTelefone(),
                Optional.empty()
        ));
        return UserDtoRegister.toEntity(user);
    }

    //GET -> users/1234
    @GetMapping
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Long userId) {
        UserCore user =  userApplication.getUserById(userId);
        return UserDtoRegister.toEntity(user);
    }

    //DELETE -> users/1234
    @DeleteMapping
    public ResponseEntity<String> deleteUserById(@PathVariable Long userId) {
        userApplication.deleteUser(userId);
        return ResponseEntity.ok().body("Sucesso");
    }

    //put -> /users
    @PutMapping
    public void UpdateUser(@Valid @RequestBody UserDtoUpdate body) {
        UserCore user = new UserCore(
                body.getEmail(),
                body.getPassword(),
                body.getNickname(),
                body.getTelefone(),
                Optional.of(body.getId())
        );

        userApplication.registerUser(user);
    }
}
