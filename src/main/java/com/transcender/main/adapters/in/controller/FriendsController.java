package com.transcender.main.adapters.in.controller;
import com.transcender.main.adapters.in.controller.dto.AddUserDto;
import com.transcender.main.application.FriendsApplication;
import com.transcender.main.domain.enuns.FriendStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("friends")
public class FriendsController {
    private final FriendsApplication friendsApplication;

    public FriendsController(FriendsApplication friendsApplication) {
        this.friendsApplication = friendsApplication;
    }

    @GetMapping
    public ResponseEntity<?> getFriends(
            @RequestHeader("Authorization") String jwt,
            @RequestParam(value = "status", required = false) String status
    ) {
        FriendStatus friendStatus = null;

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
        //adiciona um amigo
        friendsApplication.addFriend(jwt, Long.parseLong(friend.friendId()));
        return ResponseEntity.ok().body("Sucess");
    }

    @PostMapping("{userId}/remove")
    public ResponseEntity<List<Map<String, Object>>> removeFriend(
            @RequestHeader("Authorization") String jwt,
            @Valid @RequestBody @NotBlank String friendId
    ) {
        return ResponseEntity.ok().body(friendsApplication.removeFriend(jwt, Long.parseLong(friendId)));
        //remove um amimgo
    }

    @PostMapping("{userId}/block")
    public ResponseEntity<List<Map<String, Object>>> blockFriend(
            @RequestHeader("Authorization") String jwt,
            @Valid @RequestBody @NotBlank String friendId
    ) {
        return ResponseEntity.ok().body(friendsApplication.blockFriend(jwt, Long.parseLong(friendId)));
    }

    @PostMapping("{friendId}/accept")
    public ResponseEntity<String> acceptFriend(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long friendId
    ) {
        boolean accepted = friendsApplication.acceptFriend(jwt, friendId);
        if (accepted) {
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
        List<Map<String, Object>> updatedFriends = friendsApplication.removeFriend(jwt, friendId);
        // Você pode retornar uma mensagem simples ou a lista atualizada:
        return ResponseEntity.ok("Amigo removido com sucesso.");
    }

    @PostMapping("{friendId}/block")
    public ResponseEntity<String> blockFriend(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long friendId
    ) {
        List<Map<String, Object>> updatedBlockedList = friendsApplication.blockFriend(jwt, friendId);
        return ResponseEntity.ok("Usuário bloqueado com sucesso.");
    }


}
