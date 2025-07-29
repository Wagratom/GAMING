package com.transcender.main.application;

import com.transcender.main.core.Entity.ChatCore;
import com.transcender.main.core.Entity.UsuarioCore;
import com.transcender.main.core.exceptions.BadRequest;
import com.transcender.main.core.exceptions.Forbidden;
import com.transcender.main.core.exceptions.ResourceNotFound;
import com.transcender.main.core.port.in.ChatPort;
import com.transcender.main.core.port.out.ChatRepository;
import com.transcender.main.core.port.out.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collections;
import java.util.List;

@Service
public class ChatApplication implements ChatPort {

    private final ChatRepository chatRepository;
    private final UserRepository userRepository;

    @Autowired
    public ChatApplication(ChatRepository chatRepository, UserRepository userRepository) {
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ChatCore getChat(Long chatId) {
        if (chatId == null || chatId <= 0)
            throw new BadRequest("Id do chat inválido");

        return chatRepository.findChatById(chatId)
                .orElseThrow(() -> new ResourceNotFound("Chat", chatId));
    }

    @Override
    public ChatCore createChat(ChatCore chat) {
        if (chat == null)
            throw new BadRequest("Informações do chat não encontradas");

        if (isBlank(chat.getChatName()))
            throw new BadRequest("Nome do chat está vazio");

        if (chat.getChatOwner() == null || chat.getChatOwner() <= 0)
            throw new BadRequest("Id do dono inválido");

        userRepository.getUserById(chat.getChatOwner())
                .orElseThrow(() -> new ResourceNotFound("Usuário", chat.getChatOwner()));

        chat.setId(null);
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
    public ChatCore updateChat(ChatCore chatUpdate) {
        if (chatUpdate == null)
            throw new BadRequest("Informações de chat não encontradas");

        if (chatUpdate.getId() == null || chatUpdate.getId() <= 0)
            throw new BadRequest("Id do chat inválido");

        if (chatUpdate.getChatOwner() == null || chatUpdate.getChatOwner() <= 0)
            throw new BadRequest("Id do dono inválido");

        ChatCore oldChat = chatRepository.findChatById(chatUpdate.getId())
                .orElseThrow(() -> new ResourceNotFound("Chat", chatUpdate.getId()));

        if (!oldChat.getChatOwner().equals(chatUpdate.getChatOwner()))
            throw new Forbidden("Você não tem permissão para atualizar este chat");

        chatUpdate.setCriadoEm(oldChat.getCriadoEm());
        chatUpdate.setAtualizadoEm(Instant.now());

        chatRepository.updateChat(chatUpdate);
        return chatUpdate;
    }

    @Override
    public List<ChatCore> getAllChats() {
        return chatRepository.getAllChats()
                .orElse(Collections.emptyList());
    }

    @Override
    public boolean addUsuarioChat(Long chatId, UsuarioCore usuario) {
        // TODO: Implementar regra de negócio
        return false;
    }

    @Override
    public boolean bloquearUsuarioChat(Long chatId, UsuarioCore usuario) {
        // TODO: Implementar regra de negócio
        return false;
    }

    @Override
    public boolean banirUsuarioChat(Long chatId, UsuarioCore usuario) {
        // TODO: Implementar regra de negócio
        return false;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
