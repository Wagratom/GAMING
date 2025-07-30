package com.transcender.main.adapters.out.jpa;

import com.transcender.main.adapters.out.jpa.entity.ChatCoreJpa;
import com.transcender.main.adapters.out.jpa.repository.ChatRepository;
import com.transcender.main.core.Entity.ChatCore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class ChatRepositoryAdapter implements com.transcender.main.core.port.out.ChatRepository {
    private final ChatRepository chatRepository;

    @Autowired
    ChatRepositoryAdapter(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
    }

    @Override
    public Optional<ChatCore> findChatById(Long id) {
       return chatRepository.findById(id).map(this::toChatCore);
    }

    @Override
    public ChatCore createChat(ChatCore chat) {
        ChatCoreJpa chatJpa = chatRepository.save(toChatCoreJpa(chat));
        return toChatCore(chatJpa); // toChatCore que recebe diretamente o objeto, não Optional
    }


    @Override
    public ChatCore updateChat(ChatCore chat) {
        ChatCoreJpa chatJpa = chatRepository.save(toChatCoreJpa(chat));
        return toChatCore(chatJpa);
    }

    @Override
    public boolean deleteChat(Long chatId) {
        try {
            chatRepository.deleteById(chatId);
            return true;
        } catch (Exception err) {
            return false;
        }
    }

    @Override
    public List<ChatCore> getAllChats() {
        return chatRepository.findAll()
                .stream()
                .map(this::toChatCore)
                .collect(Collectors.toList());
    }

    @Override
    public boolean addUserChat(Long userId, Long chatId) {
        return false;
    }

    @Override
    public boolean bloquearUsuarioChat(Long userId, Long chatId) {
        return false;
    }

    @Override
    public boolean banirUsuarioChat(Long userId, Long chatId) {
        return false;
    }

    public ChatCoreJpa toChatCoreJpa(ChatCore chat) {
        ChatCoreJpa chatJpa = new ChatCoreJpa();
        chatJpa.setId(chat.getId());
        chatJpa.setChatName(chat.getChatName());
        chatJpa.setChatOwner(chat.getChatOwner());
        chatJpa.setDescricao(chat.getDescricao());
        chatJpa.setCriadoEm(chat.getCriadoEm());
        chatJpa.setAtualizadoEm(chat.getAtualizadoEm());
        return chatJpa;
    }

    public ChatCore toChatCore(ChatCoreJpa chatJpa) {
        return new ChatCore(
                chatJpa.getId(),
                chatJpa.getChatName(),
                chatJpa.getChatOwner(),
                chatJpa.getDescricao(),
                chatJpa.getCriadoEm(),
                chatJpa.getAtualizadoEm()
        );
    }
}
