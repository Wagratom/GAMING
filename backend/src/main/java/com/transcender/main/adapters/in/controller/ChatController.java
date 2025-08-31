package com.transcender.main.adapters.in.controller;

import com.transcender.main.adapters.in.controller.dto.ChatDtoCreate;
import com.transcender.main.adapters.in.controller.dto.NewMessageChat;
import com.transcender.main.application.ChatApplicationService;
import com.transcender.main.application.dto.ChatApplicationDto;
import com.transcender.main.domain.entity.ChatCore;
import com.transcender.main.domain.exceptions.BadRequest;
import com.transcender.main.domain.port.in.ChatPort;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class ChatController {
    private final ChatPort chatService;
    private final SimpMessagingTemplate messagingTemplate;
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    @Autowired
    public ChatController(ChatApplicationService chatService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping("")
    public ResponseEntity<String> criarChat(@Valid @RequestBody ChatDtoCreate chatDto) {
        ChatCore novoChat = chatService.createChat(new ChatCore(
                        chatDto.getChatName(),
                        chatDto.getChatOwner(),
                        chatDto.getType(),
                        chatDto.getDescricao(),
                        chatDto.getAdms()
                )
        );

        ChatCore criado = chatService.createChat(novoChat);

        ChatApplicationDto resposta = new ChatApplicationDto(
                criado.getId(),
                criado.getChatName(),
                criado.getDescricao(),
                criado.getType(),
                criado.getChatOwner()
        );

        return ResponseEntity.ok().body("Sucesso");
    }

    @GetMapping("/directChats/{friendId}")
    public ResponseEntity<Map<String, Object>> getDirectChat(
            @RequestHeader("Authorization") String jwt,
            @PathVariable("friendId") @Valid String friendId
    ) {
        return ResponseEntity.ok(chatService.getDirectChat(jwt, Long.valueOf(friendId)));
    }

    @PostMapping("/directChats/{friendId}")
    public ResponseEntity<Map<String, Object>> postDirectChat(
            @RequestHeader("Authorization") String jwt,
            @PathVariable("friendId") @Valid String friendId,
            @RequestBody @Valid NewMessageChat content
    ) {
        if (content.content().isBlank()) throw new BadRequest("Message empty");
        logger.info("[INIT] controller add new message direct chat friendId ={}", friendId);
        Map<String, Object> message = chatService.postDirectChat(jwt, Long.parseLong(friendId), content.content());
        messagingTemplate.convertAndSend("/topic/directChats/" + friendId, message);
        return ResponseEntity.ok(message);
    }

    @GetMapping
    public List<ChatApplicationDto> getAllChats() {
        return chatService.getAllChats()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private ChatApplicationDto toDto(ChatCore core) {
        return new ChatApplicationDto(
                core.getId(),
                core.getChatName(),
                core.getDescricao(),
                core.getType(),
                core.getChatOwner()
        );
    }
}
