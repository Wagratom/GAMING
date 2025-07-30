package com.transcender.main.domain.port.out;

import com.transcender.main.domain.Entity.ChatCore;

import java.util.List;
import java.util.Optional;

public interface ChatRepository {
    Optional<ChatCore> findChatById(Long id);
    ChatCore createChat(ChatCore chat);
    ChatCore updateChat(ChatCore chat);
    boolean deleteChat(Long chatId);

    List<ChatCore> getAllChats();
    boolean addUserChat(Long userId, Long chatId);
    boolean bloquearUsuarioChat(Long userId, Long chatId);
    boolean banirUsuarioChat(Long userId, Long chatId);
}
