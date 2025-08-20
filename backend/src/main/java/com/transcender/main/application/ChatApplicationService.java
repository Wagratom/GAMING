package com.transcender.main.application;

import com.transcender.main.domain.entity.ChatCore;
import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.exceptions.BadRequest;
import com.transcender.main.domain.exceptions.Forbidden;
import com.transcender.main.domain.exceptions.ResourceNotFound;
import com.transcender.main.domain.port.in.ChatPort;
import com.transcender.main.domain.port.out.ChatRepositoryPort;
import com.transcender.main.domain.port.out.JwtService;
import com.transcender.main.domain.port.out.UserRepositoryPort;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ChatApplicationService implements ChatPort {

    private final ChatRepositoryPort chatRepository;
    private final UserRepositoryPort userRepository;
    private final JwtService jwtService;

    @Autowired
    public ChatApplicationService(ChatRepositoryPort chatRepository,
                                  UserRepositoryPort userRepository,
                                  JwtService jwtService) {
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Override
    public Map<String, Object> getDirectChat(String jwt, Long friendId) {
        Map<String, Object> userInfo =  jwtService.validateTokenAndGetClaims(jwt);
        Long userId = ((Number) userInfo.get("id")).longValue();

        ChatCore chatCore = chatRepository.findDirectChatByUsers(userId, friendId)
                .orElse(chatRepository.createDirectChat(userId, friendId));

        Map<String, Object> chatJson = Map.of(
                "chatId", chatCore.getId(),
                "chatName", chatCore.getChatName(),
                "userId", userId,
                "friendId", friendId,
                "messages", List.of([]).isEmpty()
        );
        return chatJson;
    }

    @Override
    public ChatCore createChat(ChatCore chat) {
       chat.validateCreateChat();

       userRepository.getUserById(chat.getChatOwner())
                .orElseThrow(() -> new ResourceNotFound("Usuário", chat.getChatOwner()));

       return chatRepository.createChat(chat);
    }

    @Override
    public boolean deleteChat(Long chatId, Long userId) {
        if (chatId == null || chatId <= 0)
            throw new BadRequest("Id do chat inválido");

        if (userId == null || userId <= 0)
            throw new BadRequest("Id do usuário inválido");

        ChatCore chat = chatRepository.findChatById(chatId)
                .orElseThrow(() -> new ResourceNotFound("Chat", chatId));

        if (!chat.getChatOwner().equals(userId))
            throw new Forbidden("Você não tem permissão para deletar este chat");

        return chatRepository.deleteChat(chatId);
    }

    @Override
    public ChatCore updateChat(ChatCore chatUpdate, Long solicitanteId) {
        ChatCore oldChat = chatRepository.findChatById(chatUpdate.getId())
                .orElseThrow(() -> new ResourceNotFound("Chat", chatUpdate.getId()));

        oldChat.validateUpdateChat(solicitanteId);

        // Atualizações encapsuladas
        oldChat.updateChatName(chatUpdate.getChatName());
        oldChat.updateDescricao(chatUpdate.getDescricao());
        oldChat.updateType(chatUpdate.getType());

        chatRepository.updateChat(oldChat);
        return oldChat;
    }

    @Override
    public List<ChatCore> getAllChats() {
        return chatRepository.getAllChats();
    }

    @Override
    public boolean addUsuarioChat(Long chatId, UserCore usuario) {
        // TODO: Implementar regra de negócio
        return false;
    }

    @Override
    public boolean bloquearUsuarioChat(Long chatId, UserCore usuario) {
        // TODO: Implementar regra de negócio
        return false;
    }

    @Override
    public boolean banirUsuarioChat(Long chatId, UserCore usuario) {
        // TODO: Implementar regra de negócio
        return false;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
