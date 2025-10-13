package com.transcender.main.adapters.in.controller;

import com.transcender.main.adapters.in.controller.dto.LoginDto;
import com.transcender.main.adapters.in.controller.dto.UserDtoRegister;
import com.transcender.main.application.UserApplication;
import com.transcender.main.domain.entity.UserCore;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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

@Tag(name = "Autenticação", description = "Endpoints relacionados à autenticação de usuários (login, logout e registro).")
@RestController
public class AuthController {

    private final UserApplication userApplication;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public AuthController(UserApplication userApplication, SimpMessagingTemplate messagingTemplate) {
        this.userApplication = userApplication;
        this.messagingTemplate = messagingTemplate;
    }

    @Operation(
            summary = "Realiza login do usuário",
            description = """
                    Endpoint responsável por autenticar o usuário através do nickname ou e-mail e senha.
                    Retorna um token JWT no corpo da resposta e também define o cookie de autenticação (HTTP-only).
                    """
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login realizado com sucesso",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(example = "{\"token\": \"<jwt-token>\"}"))),
            @ApiResponse(responseCode = "400", description = "Requisição inválida ou campos ausentes", content = @Content),
            @ApiResponse(responseCode = "401", description = "Credenciais inválidas", content = @Content)
    })
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@Valid @RequestBody LoginDto body) {
        String token = userApplication.login(body.nickname(), body.email(), body.password());

        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(true) // Use true se estiver rodando com HTTPS
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
            summary = "Realiza logout do usuário",
            description = """
                    Invalida o token JWT do usuário autenticado e envia uma notificação via WebSocket
                    informando o ID do usuário que realizou o logout.
                    """
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Logout realizado com sucesso"),
            @ApiResponse(responseCode = "401", description = "Token inválido ou ausente", content = @Content)
    })
    @PatchMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String jwt) {
        Long userId = userApplication.logout(jwt);
        messagingTemplate.convertAndSend("/topic/logout", userId);
        return ResponseEntity.ok().body("Success");
    }

    @Operation(
            summary = "Registra um novo usuário",
            description = """
                    Cria uma nova conta de usuário com os dados fornecidos no corpo da requisição.
                    Os campos são validados automaticamente conforme as anotações no DTO.
                    """
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuário registrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Campos inválidos ou ausentes", content = @Content),
            @ApiResponse(responseCode = "409", description = "Usuário já existe com o mesmo e-mail ou nickname", content = @Content)
    })
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
        return ResponseEntity.ok("usuário registrado com sucesso");
    }
}
