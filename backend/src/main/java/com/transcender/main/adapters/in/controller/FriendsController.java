package com.transcender.main.adapters.in.controller;

import com.transcender.main.adapters.in.controller.dto.AddUserDto;
import com.transcender.main.application.FriendsApplication;
import com.transcender.main.domain.enuns.FriendStatus;
import jakarta.validation.Valid;
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
    private final SimpMessagingTemplate messagingTemplate;

    public FriendsController(FriendsApplication friendsApplication,
                             SimpMessagingTemplate messagingTemplate) {
        this.friendsApplication = friendsApplication;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping
    public ResponseEntity<?> getFriends(
            @RequestHeader("Authorization") String jwt,
            @RequestParam(value = "status", required = false) String status
    ) {
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
                            """
                ));
            }
        } else {
            friendStatus = FriendStatus.ACCEPTED;
        }
        return ResponseEntity.ok(friendsApplication.getFriends(jwt, friendStatus));
    }

    @PostMapping
    public ResponseEntity<String> addFriend(
            @RequestHeader("Authorization") String jwt,
            @Valid @RequestBody AddUserDto friend
    ) {
        friendsApplication.addFriend(jwt, Long.parseLong(friend.friendId()));

        // Notifica o destinatário
        messagingTemplate.convertAndSend("/topic/user/" + friend.friendId(),
                Map.of("type", "FRIEND_REQUEST", "message", "Você recebeu uma solicitação de amizade"));

        return ResponseEntity.ok("Success");
    }

    @PostMapping("{friendId}/accept")
    public ResponseEntity<String> acceptFriend(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long friendId
    ) {
        boolean accepted = friendsApplication.acceptFriend(jwt, friendId);

        if (accepted) {
            // Notifica o solicitante original
            messagingTemplate.convertAndSend("/topic/user/" + friendId,
                    Map.of("type", "FRIEND_ACCEPTED", "message", "Sua solicitação de amizade foi aceita"));
            return ResponseEntity.ok("Solicitação de amizade aceita com sucesso.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Não foi possível aceitar a solicitação de amizade.");
        }
    }

    @PostMapping("{friendId}/remove")
    public ResponseEntity<String> removeFriend(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long friendId
    ) {
        friendsApplication.removeFriend(jwt, friendId);

        messagingTemplate.convertAndSend("/topic/user/" + friendId,
                Map.of("type", "FRIEND_REMOVED", "message", "Você foi removido da lista de amigos"));

        return ResponseEntity.ok("Amigo removido com sucesso.");
    }

    @PostMapping("{friendId}/block")
    public ResponseEntity<String> blockFriend(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long friendId
    ) {
        friendsApplication.blockFriend(jwt, friendId);

        messagingTemplate.convertAndSend("/topic/user/" + friendId,
                Map.of("type", "FRIEND_BLOCKED", "message", "Você foi bloqueado"));

        return ResponseEntity.ok("Usuário bloqueado com sucesso.");
    }
}
