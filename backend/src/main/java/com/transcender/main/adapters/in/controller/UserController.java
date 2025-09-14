package com.transcender.main.adapters.in.controller;

import com.transcender.main.adapters.in.controller.dto.UserDtoRegister;
import com.transcender.main.adapters.in.controller.dto.responses.ProfileResponse;
import com.transcender.main.adapters.in.controller.dto.responses.UserResponse;
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
import java.util.Optional;
import java.util.stream.Collectors;

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
    public ResponseEntity<UserResponse> getMyUser(
            @RequestHeader("Authorization")
            @Parameter(description = "Token JWT do usuário") String jwt
    ) {
        return ResponseEntity.ok(new UserResponse(userApplication.getUserByToken(jwt)));
    }

    @GetMapping("/profile/{userId}")
    @Operation(summary = "Retorna o perfil detalhado do usuário logado")
    public ResponseEntity<ProfileResponse> getMyProfile(
            @RequestHeader("Authorization")
            @Parameter(description = "Token JWT do usuário") String jwt,
            @PathVariable("userId") String userId
    ) {
        return ResponseEntity.ok(new ProfileResponse(userApplication.getProfile(jwt, Long.valueOf(userId))));
    }

    @GetMapping
    @Operation(summary = "Lista todos os usuários, opcionalmente filtrando por online")
    public ResponseEntity<List<UserResponse>> listUsers(
            @RequestParam(required = false)
            @Parameter(description = "Filtrar apenas usuários online") Boolean online,
            @RequestHeader("Authorization")
            @Parameter(description = "Token JWT do usuário") String jwt
    ) {
        return ResponseEntity.ok(
                userApplication.getUsers(online, jwt)
                        .stream()
                        .map((user) -> new UserResponse(user))
                        .collect(Collectors.toList())
        );
    }


    @GetMapping("/{userId}")
    @Operation(summary = "Retorna um usuário pelo ID")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable
            @Parameter(description = "ID do usuário") Long userId
    ) {
        return ResponseEntity.ok(new UserResponse(userApplication.getUserById(userId)));
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
