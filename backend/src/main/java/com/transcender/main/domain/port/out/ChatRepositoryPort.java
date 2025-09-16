package com.transcender.main.domain.port.out;

import com.transcender.main.domain.entity.ChatCore;
import com.transcender.main.domain.entity.MessageCore;
import com.transcender.main.domain.entity.UserCore;

import java.util.List;
import java.util.Optional;

public interface ChatRepositoryPort {
    ChatCore getOrCreateDirectChat(UserCore user1, UserCore user2);
    MessageCore addNewMessageDirectChat(UserCore sender, UserCore friendId, String content);
    Optional<ChatCore> findChatById(Long chatId);
    ChatCore createChat(ChatCore chat);
    ChatCore updateChat(ChatCore chat);
    boolean deleteChat(Long chatId);

    List<ChatCore> getPublicChats();
    boolean addUserChat(Long userId, Long chatId);
    boolean bloquearUsuarioChat(Long userId, Long chatId);
    boolean banirUsuarioChat(Long userId, Long chatId);
}
