package com.transcender.main.core.port.out;

import com.transcender.main.core.Entity.ChatCore;

import java.util.List;
import java.util.Optional;

public interface ChatRepository {
    Optional<ChatCore> findChatById(Long id);
    ChatCore createChat(ChatCore chat);
    ChatCore updateChat(ChatCore chat);
    boolean deleteChat(Long chatId);

    Optional<List<ChatCore>> getAllChats();
    boolean addUserChat(Long userId, Long chatId);
    boolean bloquearUsuarioChat(Long userId, Long chatId);
    boolean banirUsuarioChat(Long userId, Long chatId);
}
