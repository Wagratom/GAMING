package com.transcender.main.adapters.in.controller;

import com.transcender.main.adapters.in.controller.dto.UserDtoRegister;
import com.transcender.main.application.FriendsApplication;
import com.transcender.main.application.UserApplication;
import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.port.in.UserPortIn;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@Tag(name = "User", description = "Operações de usuários")
public class UserController {

    private final UserPortIn userApplication;

    public UserController(UserApplication userApplication) {
        this.userApplication = userApplication;
    }

    @GetMapping("/me")
    @Operation(summary = "Retorna os dados do usuário logado")
    public ResponseEntity<UserApplication.UserResponse> getMyUser(
            @RequestHeader("Authorization")
            @Parameter(description = "Token JWT do usuário") String jwt
    ) {
        return ResponseEntity.ok(userApplication.getUserByToken(jwt));
    }

    @GetMapping("/profile")
    @Operation(summary = "Retorna o perfil detalhado do usuário logado")
    public ResponseEntity<Map<String, Object>> getMyProfile(
            @RequestHeader("Authorization")
            @Parameter(description = "Token JWT do usuário") String jwt
    ) {
        return ResponseEntity.ok(userApplication.getProfile(jwt));
    }

    @GetMapping
    @Operation(summary = "Lista todos os usuários, opcionalmente filtrando por online")
    public ResponseEntity<List<Map<String, Object>>> listUsers(
            @RequestParam(required = false)
            @Parameter(description = "Filtrar apenas usuários online") Boolean online,
            @RequestHeader("Authorization")
            @Parameter(description = "Token JWT do usuário") String jwt
    ) {
        return ResponseEntity.ok(userApplication.getUsers(online, jwt));
    }

    @PostMapping
    @Operation(summary = "Registra um novo usuário")
    public ResponseEntity<Map<String, Object>> registerUser(
            @Valid @RequestBody
            @Parameter(description = "Dados do usuário a ser registrado") UserDtoRegister body
    ) {
        UserCore user = userApplication.registerUser(new UserCore(
                body.getEmail(),
                body.getPassword(),
                body.getNickname(),
                body.getTelefone(),
                Optional.empty()
        ));
        return UserDtoRegister.toEntity(user);
    }

    @GetMapping("/{userId}")
    @Operation(summary = "Retorna um usuário pelo ID")
    public ResponseEntity<Map<String, Object>> getUserById(
            @PathVariable
            @Parameter(description = "ID do usuário") Long userId
    ) {
        return ResponseEntity.ok(userApplication.getUserById(userId));
    }

    @DeleteMapping("/{userId}")
    @Operation(summary = "Deleta um usuário pelo ID")
    public ResponseEntity<String> deleteUserById(
            @PathVariable
            @Parameter(description = "ID do usuário") Long userId
    ) {
        userApplication.deleteUser(userId);
        return ResponseEntity.ok().body("Sucesso");
    }
}
