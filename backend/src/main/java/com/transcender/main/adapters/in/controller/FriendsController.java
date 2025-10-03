package com.transcender.main.adapters.in.controller;

import com.transcender.main.adapters.in.controller.dto.AddUserDto;
import com.transcender.main.application.FriendsApplication;
import com.transcender.main.domain.enuns.FriendStatus;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import java.util.Map;

@RestController
@RequestMapping("friends")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class FriendsController {
    private final FriendsApplication friendsApplication;
    private static final Logger logger = LoggerFactory.getLogger(FriendsController.class);

    public FriendsController(FriendsApplication friendsApplication, SimpMessagingTemplate messagingTemplate) {
        this.friendsApplication = friendsApplication;
    }

    @Operation(summary = "Lista amigos do usuário", description = "Retorna a lista de amigos filtrando pelo status opcional (PENDING, ACCEPTED, DECLINED, BLOCKED, REMOVED).")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de amigos retornada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Status inválido ou requisição malformada"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    @GetMapping
    public ResponseEntity<?> getFriends(@RequestHeader("Authorization") String jwt,
                                        @RequestParam(value = "status", required = false) String status) {
        FriendStatus friendStatus;
        if (status != null && !status.isBlank()) {
            try {
                friendStatus = FriendStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Status inválido. Valores permitidos: PENDING, ACCEPTED, DECLINED, BLOCKED, REMOVED"
                ));
            }
        } else {
            friendStatus = FriendStatus.ACCEPTED;
        }
        return ResponseEntity.ok(friendsApplication.getFriends(jwt, friendStatus));
    }

    @Operation(summary = "Adiciona um novo amigo", description = "Envia uma solicitação de amizade para outro usuário pelo ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Solicitação de amizade enviada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro na requisição"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    @PostMapping
    public ResponseEntity<String> addFriend(@RequestHeader("Authorization") String jwt,
                                            @Valid @RequestBody AddUserDto friend) {
        logger.info("Iniciando controller para adicionar um amigo");
        friendsApplication.addFriend(jwt, Long.parseLong(friend.friendId()));
        return ResponseEntity.ok("Success");
    }

    @Operation(summary = "Aceita solicitação de amizade", description = "Aceita uma solicitação de amizade pendente.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Solicitação de amizade aceita com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro na requisição"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    @PostMapping("{friendId}/accept")
    public ResponseEntity<String> acceptFriend(@RequestHeader("Authorization") String jwt,
                                               @PathVariable Long friendId) {
        logger.info("Aceitando solicitação de amizade");
        friendsApplication.acceptFriend(jwt, friendId);
        return ResponseEntity.ok("Solicitação de amizade aceitada com sucesso.");
    }

    @Operation(summary = "Recusa solicitação de amizade", description = "Recusa uma solicitação de amizade pendente.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Solicitação de amizade recusada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro na requisição"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    @PostMapping("{friendId}/decline")
    public ResponseEntity<String> declineFriend(@RequestHeader("Authorization") String jwt,
                                                @PathVariable Long friendId) {
        logger.info("Recusando solicitação de amizade");
        friendsApplication.declineFriend(jwt, friendId);
        return ResponseEntity.ok("Solicitação de amizade recusada com sucesso.");
    }

    @Operation(summary = "Remove amigo", description = "Remove um amigo da lista de contatos do usuário.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Amigo removido com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro na requisição"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    @PostMapping("{friendId}/remove")
    public ResponseEntity<String> removeFriend(@RequestHeader("Authorization") String jwt,
                                               @PathVariable Long friendId) {
        logger.info("Removendo amigo");
        friendsApplication.removeFriend(jwt, friendId);
        return ResponseEntity.ok("Amigo removido com sucesso.");
    }

    @Operation(summary = "Bloqueia amigo", description = "Bloqueia um usuário, impedindo futuras interações de amizade.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuário bloqueado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro na requisição"),
            @ApiResponse(responseCode = "401", description = "Não autorizado")
    })
    @PostMapping("{friendId}/block")
    public ResponseEntity<String> blockFriend(@RequestHeader("Authorization") String jwt,
                                              @PathVariable Long friendId) {
        logger.info("Bloqueando amigo");
        friendsApplication.blockFriend(jwt, friendId);
        return ResponseEntity.ok("Usuário bloqueado com sucesso.");
    }
}
