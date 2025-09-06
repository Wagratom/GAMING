package com.transcender.main.adapters.in.controller;

import com.transcender.main.adapters.in.controller.dto.AddUserDto;
import com.transcender.main.application.FriendsApplication;
import com.transcender.main.domain.enuns.FriendStatus;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping
    public ResponseEntity<?> getFriends(@RequestHeader("Authorization") String jwt,
                                        @RequestParam(value = "status", required = false) String status) {

        FriendStatus friendStatus;

        if (status != null && !status.isBlank()) {
            try {
                friendStatus = FriendStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                        "error", """
                                Status inválido. Valores permitidos:
                                PENDING   - Awaiting response from the other user
                                ACCEPTED  - Both users are friends
                                DECLINED  - Friend request was declined
                                BLOCKED   - One user blocked the other
                                REMOVED   - Removed from friends list
                                """));
            }
        } else {
            friendStatus = FriendStatus.ACCEPTED;
        }
        return ResponseEntity.ok(friendsApplication.getFriends(jwt, friendStatus));
    }

    @PostMapping
    public ResponseEntity<String> addFriend(@RequestHeader("Authorization") String jwt,
                                            @Valid @RequestBody AddUserDto friend) {

        logger.info("Iniciando controller para adicionar um amigo");
        friendsApplication.addFriend(jwt, Long.parseLong(friend.friendId()));
        return ResponseEntity.ok("Success");
    }

    @PostMapping("{friendId}/accept")
    public ResponseEntity<String> acceptFriend(@RequestHeader("Authorization") String jwt,
                                               @PathVariable Long friendId) {

        logger.info("Iniciando controller para aceitar um amigo");
        friendsApplication.acceptFriend(jwt, friendId);
        return ResponseEntity.ok("Solicitação de amizade aceitada com sucesso.");
    }

    @PostMapping("{friendId}/decline")
    public ResponseEntity<String> declineFriend(@RequestHeader("Authorization") String jwt,
                                                @PathVariable Long friendId) {

        logger.info("Iniciando controller para recusar um amigo");
        friendsApplication.declineFriend(jwt, friendId);
        return ResponseEntity.ok("Solicitação de amizade recusada com sucesso.");
    }

    @PostMapping("{friendId}/remove")
    public ResponseEntity<String> removeFriend(@RequestHeader("Authorization") String jwt,
                                               @PathVariable Long friendId) {
        logger.info("Iniciando controller para remover um amigo");
        return ResponseEntity.ok("Amigo removido com sucesso.");
    }

    @PostMapping("{friendId}/block")
    public ResponseEntity<String> blockFriend(@RequestHeader("Authorization") String jwt, @PathVariable Long friendId) {

        logger.info("Iniciando controller para blockear um amigo");
        friendsApplication.blockFriend(jwt, friendId);
        return ResponseEntity.ok("Usuário bloqueado com sucesso.");
    }
}
