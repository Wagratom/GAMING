package com.transcender.main.adapters.in.controller;

import com.transcender.main.adapters.in.controller.dto.LoginDto;
import com.transcender.main.adapters.in.controller.dto.UserDtoRegister;
import com.transcender.main.application.UserApplication;
import com.transcender.main.domain.entity.UserCore;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.parameters.RequestBody;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
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
@Tag(name = "Auth API", description = "Endpoints de autenticação e registro de usuários")
public class AuthController {

    private final UserApplication userApplication;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public AuthController(UserApplication userApplication, SimpMessagingTemplate messagingTemplate) {
        this.userApplication = userApplication;
        this.messagingTemplate = messagingTemplate;
    }

    @Operation(
            summary = "Login do usuário",
            description = "Autentica o usuário e retorna um token JWT no cookie e no corpo da resposta",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Login bem-sucedido",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(example = "{\"token\": \"jwt-token-aqui\"}"))),
                    @ApiResponse(responseCode = "401", description = "Credenciais inválidas")
            }
    )
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody LoginDto body) {
        String token = userApplication.login(body.nickname(), body.email(), body.password());
        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(Duration.ofHours(1))
                .sameSite("Strict")
                .build();

        messagingTemplate.convertAndSend("/topic/login", body.nickname());
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(Map.of("token", token));
    }

    @Operation(
            summary = "Logout do usuário",
            description = "Invalida o token JWT do usuário e envia notificação via WebSocket",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Logout realizado com sucesso"),
                    @ApiResponse(responseCode = "401", description = "Token inválido")
            }
    )
    @PatchMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String jwt) {
        Long userId = userApplication.logout(jwt);
        messagingTemplate.convertAndSend("/topic/logout", userId);
        return ResponseEntity.ok().body("Success");
    }

    @Operation(
            summary = "Registro de usuário",
            description = "Cria um novo usuário no sistema",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Usuário registrado com sucesso"),
                    @ApiResponse(responseCode = "400", description = "Dados inválidos")
            }
    )
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody UserDtoRegister body) {
        UserCore user = userApplication.registerUser(
                new UserCore(
                        body.getEmail(),
                        body.getPassword(),
                        body.getNickname(),
                        body.getTelefone(),
                        Optional.empty()
                )
        );
        return ResponseEntity.ok("Usuário registrado com sucesso");
    }
}
