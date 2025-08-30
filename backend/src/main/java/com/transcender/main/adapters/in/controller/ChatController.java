package com.transcender.main.adapters.in.controller;

import com.transcender.main.adapters.in.controller.dto.ChatDtoCreate;
import com.transcender.main.application.ChatApplicationService;
import com.transcender.main.application.dto.ChatApplicationDto;
import com.transcender.main.domain.entity.ChatCore;
import com.transcender.main.domain.port.in.ChatPort;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class ChatController {
    private final ChatPort chatService;

    @Autowired
    public ChatController(ChatApplicationService chatService){
        this.chatService = chatService;
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
            @PathVariable("friendId") @Valid String friendId
    ) {
        return ResponseEntity.ok(chatService.getDirectChat(jwt, Long.valueOf(friendId)));
    }

    @GetMapping
    public List<ChatApplicationDto> getAllChats(){
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
