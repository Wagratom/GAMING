package com.transcender.main.adapters.in.controller;

import com.transcender.main.adapters.in.controller.dto.ChatDtoCreate;
import com.transcender.main.adapters.in.controller.dto.NewMessageChat;
import com.transcender.main.adapters.in.controller.dto.responses.ChatResponse;
import com.transcender.main.adapters.in.controller.dto.responses.DirectChatResponse;
import com.transcender.main.domain.entity.ChatCore;
import com.transcender.main.domain.exceptions.BadRequest;
import com.transcender.main.domain.port.in.ChatPort;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Chat API", description = "Endpoints para gerenciamento de chats diretos, grupos e mensagens")
public class ChatController {

    private final ChatPort chatService;
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    @Operation(summary = "Obter chat direto com amigo", description = "Retorna o chat privado entre o usuário autenticado e outro usuário (amigo).")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Chat direto retornado com sucesso"),
            @ApiResponse(responseCode = "403", description = "Usuário não tem amizade com o outro usuário"),
            @ApiResponse(responseCode = "404", description = "Chat ou usuário não encontrado"),
            @ApiResponse(responseCode = "401", description = "Token inválido ou expirado")
    })
    @GetMapping("/directChats/{friendId}")
    public ResponseEntity<DirectChatResponse> getDirectChat(
            @RequestHeader("Authorization") String jwt,
            @PathVariable("friendId") @Valid String friendId
    ) {
        ChatCore directChat = chatService.getDirectChat(jwt, Long.valueOf(friendId));
        return ResponseEntity.ok(new DirectChatResponse(directChat.getMessagens()));
    }

    @Operation(summary = "Adicionar mensagem em chat direto", description = "Adiciona uma nova mensagem para o chat direto entre o usuário autenticado e outro usuário.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Mensagem adicionada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Mensagem vazia"),
            @ApiResponse(responseCode = "403", description = "Usuário não tem amizade com o destinatário")
    })
    @PostMapping("/directChats/{friendId}")
    public ResponseEntity<String> addMessageChat(
            @RequestHeader("Authorization") String jwt,
            @PathVariable("friendId") @Valid String friendId,
            @RequestBody @Valid NewMessageChat content
    ) {
        if (content.content().isBlank()) throw new BadRequest("Message empty");
        logger.info("[INIT] add new message direct chat friendId={}", friendId);
        chatService.addMessageDirectChat(jwt, Long.parseLong(friendId), content.content());
        return ResponseEntity.ok("Mensagem enviada com sucesso");
    }

    @Operation(summary = "Listar chats públicos", description = "Retorna todos os grupos de chat públicos disponíveis.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de chats retornada com sucesso")
    })
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

    @Operation(summary = "Criar novo grupo de chat", description = "Cria um novo grupo de chat do tipo PUBLIC ou PROTECT. Para PROTECT é necessário fornecer uma senha.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Chat criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Tipo de chat inválido")
    })
    @PostMapping("/groups")
    public ResponseEntity<ChatResponse> createPublicChats(
            @RequestHeader("Authorization") String jwt,
            @Valid @RequestBody ChatDtoCreate chatDto
    ) {
        logger.info("[INIT] create group chat name={}", chatDto.getChatName());
        if (!chatDto.getType().name().equals("PUBLIC") && !chatDto.getType().name().equals("PROTECT")) {
            throw new BadRequest("Tipo de chat inválido, deve ser PUBLIC ou PROTECT");
        }
        ChatCore chats = chatService.createChat(chatDto.toChatCore(), jwt);
        return ResponseEntity.ok(new ChatResponse(chats));
    }

    @Operation(summary = "Adicionar mensagem em grupo", description = "Adiciona uma nova mensagem em um grupo de chat existente do qual o usuário faz parte.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Mensagem adicionada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Mensagem vazia"),
            @ApiResponse(responseCode = "403", description = "Usuário não tem permissão de enviar mensagem neste grupo")
    })
    @PostMapping("/add-message-groups/{chatId}")
    public ResponseEntity<String> addMessageGroups(
            @RequestHeader("Authorization") String jwt,
            @PathVariable("chatId") @Valid String chatId,
            @RequestBody @Valid NewMessageChat content
    ) {
        if (content.content().isBlank()) throw new BadRequest("Message empty");
        logger.info("[INIT] add message group chatId={}", chatId);
        chatService.addMessageGroups(jwt, Long.parseLong(chatId), content.content());
        return ResponseEntity.ok("Mensagem enviada com sucesso");
    }

    @Operation(summary = "Adicionar usuário em chat público", description = "Adiciona o usuário autenticado a um grupo público existente.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuário adicionado com sucesso")
    })
    @PostMapping("/add-user-public-chat")
    public ResponseEntity<String> addUserChatPublic(
            @RequestHeader("Authorization") String jwt,
            @RequestBody @Valid Long chatId
    ) {
        logger.info("[INIT] add user in public chat chatId={}", chatId);
        chatService.addUserPublicChat(jwt, chatId);
        return ResponseEntity.ok("Usuário adicionado com sucesso");
    }

    @Operation(summary = "Obter chat por ID", description = "Retorna um grupo de chat pelo seu ID, adicionando automaticamente o usuário caso ele ainda não seja membro.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Chat retornado com sucesso"),
            @ApiResponse(responseCode = "403", description = "Usuário não tem permissão para acessar chat protegido")
    })
    @GetMapping("/groups/{chatId}")
    public ResponseEntity<ChatResponse> getChatId(
            @RequestHeader("Authorization") String jwt,
            @PathVariable Long chatId
    ) {
        ChatCore chats = chatService.getGroupChatById(jwt, chatId);
        return ResponseEntity.ok(new ChatResponse(chats));
    }

    @Operation(summary = "Abrir chat por nome", description = "Retorna um grupo de chat pelo nome. Para chats protegidos, é possível fornecer uma senha.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Chat retornado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Nome do chat obrigatório ou senha inválida"),
            @ApiResponse(responseCode = "403", description = "Senha inválida para chat protegido")
    })
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
