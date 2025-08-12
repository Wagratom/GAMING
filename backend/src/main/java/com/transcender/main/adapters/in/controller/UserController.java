package com.transcender.main.adapters.in.controller;

import com.transcender.main.adapters.in.controller.dto.UserDtoRegister;
import com.transcender.main.application.UserApplication;
import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.port.in.UserPortIn;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserPortIn userApplication;

    public UserController(UserApplication userApplication) {
        this.userApplication = userApplication;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> listUsers(
            @RequestParam(required = false) Boolean online,
            @RequestHeader("Authorization") String jwt
    ) {
        return ResponseEntity.ok().body(
                userApplication.getUsers(online, jwt)
        );
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
    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable Long userId) {
        return UserDtoRegister.toEntity(userApplication.getUserById(userId));
    }

    //DELETE -> users/1234
    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUserById(@PathVariable Long userId) {
        userApplication.deleteUser(userId);
        return ResponseEntity.ok().body("Sucesso");
    }

    //put -> /users
    //@PutMapping
    //public ResponseEntity<String, Object> UpdateUser(@Valid @RequestBody UserDtoUpdate body) {
    //    UserCore user = new UserCore(
    //            body.getEmail(),
    //            body.getPassword(),
    //            body.getNickname(),
    //            body.getTelefone(),
    //            Optional.of(body.getId())
    //    );

    //    userApplication.updateUser(user);
    //    ResponseEntity.ok().
    //}
}

