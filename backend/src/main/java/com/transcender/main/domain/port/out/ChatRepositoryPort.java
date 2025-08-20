package com.transcender.main.domain.port.out;

import com.transcender.main.domain.entity.ChatCore;
import com.transcender.main.domain.entity.UserCore;

import java.util.List;
import java.util.Optional;

public interface ChatRepositoryPort {
    Optional<ChatCore> findDirectChatByUsers(Long userId, Long friendId);
    ChatCore createDirectChat(UserCore user, UserCore friend);
    Optional<ChatCore> findChatById(Long chatId);
    ChatCore createChat(ChatCore chat);
    ChatCore updateChat(ChatCore chat);
    boolean deleteChat(Long chatId);

    List<ChatCore> getAllChats();
    boolean addUserChat(Long userId, Long chatId);
    boolean bloquearUsuarioChat(Long userId, Long chatId);
    boolean banirUsuarioChat(Long userId, Long chatId);
}
