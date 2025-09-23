package com.transcender.main.adapters.in.controller;

import com.transcender.main.adapters.in.controller.dto.ChatDtoCreate;
import com.transcender.main.adapters.in.controller.dto.NewMessageChat;
import com.transcender.main.adapters.in.controller.dto.responses.ChatResponse;
import com.transcender.main.adapters.in.controller.dto.responses.DirectChatResponse;
import com.transcender.main.domain.entity.ChatCore;
import com.transcender.main.domain.exceptions.BadRequest;
import com.transcender.main.domain.port.in.ChatPort;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Validated
public class ChatController {
    private final ChatPort chatService;
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);


//    @PostMapping("")
//    public ResponseEntity<String> criarChat(@Valid @RequestBody ChatDtoCreate chatDto) {
//        ChatCore novoChat = chatService.createChat(new ChatCore(
//                        chatDto.getChatName(),
//                        chatDto.getChatOwner(),
//                        chatDto.getType(),
//                        chatDto.getDescricao(),
//                        chatDto.getAdms()
//                )
//        );
//
//        ChatCore criado = chatService.createChat(novoChat);
//        return ResponseEntity.ok().body("Sucesso");
//    }

    //TODO ao invès de criar uma nova dto use a da aplicacao direct chat
    @GetMapping("/directChats/{friendId}")
    public ResponseEntity<DirectChatResponse> getDirectChat(
            @RequestHeader("Authorization") String jwt,
            @PathVariable("friendId") @Valid String friendId
    ) {
        ChatCore directChat = chatService.getDirectChat(jwt, Long.valueOf(friendId));
        return ResponseEntity.ok(new DirectChatResponse(directChat.getMessagens()));
    }

    @PostMapping("/directChats/{friendId}")
    public ResponseEntity<String> addMessageChat(
            @RequestHeader("Authorization") String jwt,
            @PathVariable("friendId") @Valid String friendId,
            @RequestBody @Valid NewMessageChat content
    ) {
        if (content.content().isBlank()) throw new BadRequest("Message empty");
        logger.info("[INIT] controller add new message direct chat friendId ={}", friendId);
        chatService.addMessageDirectChat(jwt, Long.parseLong(friendId), content.content());
        return ResponseEntity.ok("sucesso");
    }

    @GetMapping("/groups")
    public ResponseEntity<List<ChatResponse>> getPublicChats(
            @RequestHeader("Authorization") String jwt
    ) {
        return ResponseEntity.ok(
                chatService.getPublicsChats(jwt)
                        .stream().map(ChatResponse::new)
                        .collect(Collectors.toList())
        );
    }

    @PostMapping("/groups")
    public ResponseEntity<ChatResponse> createPublicChats(
            @RequestHeader("Authorization") String jwt,
            @Valid @RequestBody ChatDtoCreate chatDto
    ) {
        logger.info("[INIT] controller create grupo chat name {}", chatDto.getChatName());
        if (!chatDto.getType().name().equals("PUBLIC") && !chatDto.getType().name().equals("PROTECT")) {
            throw new BadRequest("Tipo de chat invalido, deve ser PROTECT ou PUBLIC");
        }

        ChatCore chats = chatService.createChat(chatDto.toChatCore(), jwt);
        return ResponseEntity.ok(new ChatResponse(chats));
    }

    @GetMapping("/groups/{chatId}")
    public ResponseEntity<ChatResponse> getChatId(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long chatId
    ) {
        ChatCore chats = chatService.getGroupChatById(jwt, chatId);
        return ResponseEntity.ok(new ChatResponse(chats));
    }

    @GetMapping("/open-groups")
    public ResponseEntity<ChatResponse> openGroups(
            @RequestHeader("Authorization") String jwt,
            @NotBlank(message = "O nome do chat é obrigatório.")
            @RequestParam String chatName,
            @RequestParam(required = false) String password
    ) {
        ChatCore chats = chatService.openChat(jwt, chatName, password);
        return ResponseEntity.ok(new ChatResponse(chats));
    }
}
