package com.transcender.main.adapters.in.controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("friends")
public class FriendsController {

    @GetMapping
    public void getFriends(@RequestHeader("Authorization") String jwt) {
    //retorna todos os amigos
    }

    @PostMapping
    public void addFriend(@RequestHeader("Authorization") String jwt) {
        //adiciona um amigo
    }

    @PostMapping("{userId}/remove")
    public void removeFriend(@RequestHeader("Authorization") String jwt) {
        //remove um amimgo
    }

    @PostMapping("{userId}/block")
    public void blockFriend(@RequestHeader("Authorization") String jwt) {
        //bloqueia um amigo
    }

}
