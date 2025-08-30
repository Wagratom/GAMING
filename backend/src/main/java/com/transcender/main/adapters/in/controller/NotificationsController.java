package com.transcender.main.adapters.in.controller;

import com.transcender.main.application.ChatApplicationService;
import com.transcender.main.application.FriendsApplication;
import com.transcender.main.domain.enuns.FriendStatus;
import com.transcender.main.domain.exceptions.BadRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
public class NotificationsController {

    private final FriendsApplication friendsApplication;
    private final Logger logger = LoggerFactory.getLogger(ChatApplicationService.class);

    @Autowired
    public NotificationsController(FriendsApplication friendsApplication) {
        this.friendsApplication = friendsApplication;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getNotifications(
            @RequestHeader("Authorization") String jwt,
            @RequestParam(value = "status", required = false, defaultValue = "PENDING") String filter) {

        logger.info("[CONTROLLER INIT] Pegando notificações do usuario");

        if (!filter.equalsIgnoreCase("PENDING") && !filter.equalsIgnoreCase("ALL")) {
            throw new BadRequest("""
            Status inválido. Valores permitidos:
            PENDING - Awaiting response from the other user
            ALL     - Both users are friends
        """);
        }

        if (filter.equalsIgnoreCase("PENDING")) {
            return ResponseEntity.ok(friendsApplication.getFriendsNotication(jwt, FriendStatus.PENDING));
        }

        // TODO: implementar "ALL"
        return ResponseEntity.ok(List.of());
    }

}
