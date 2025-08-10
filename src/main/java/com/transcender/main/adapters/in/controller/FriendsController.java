package com.transcender.main.adapters.in.controller;
import com.transcender.main.application.FriendsApplication;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
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
    public ResponseEntity<List<Map<String, Object>>> getFriends(@RequestHeader("Authorization") String jwt) {
        return ResponseEntity.ok().body(friendsApplication.getFriends(jwt));
    }

    @PostMapping
    public ResponseEntity<String> addFriend(
            @RequestHeader("Authorization") String jwt,
            @Valid @RequestBody @NotBlank String friendId
    ) {
        //adiciona um amigo
        friendsApplication.addFriend(jwt, Long.parseLong(friendId));
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

}
