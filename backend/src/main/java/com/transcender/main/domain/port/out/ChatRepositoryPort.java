package com.transcender.main.domain.port.out;

import com.transcender.main.domain.entity.ChatCore;
import com.transcender.main.domain.entity.MessageCore;
import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.enuns.PermitionChat;

import java.util.List;
import java.util.Optional;

public interface ChatRepositoryPort {
    record responsePrivateChat(ChatCore chat, UserCore sender) {};

    responsePrivateChat getOrCreateDirectChat(Long requester, UserCore user2);

    MessageCore addNewMessageDirectChat(responsePrivateChat addMessageDto, String content);
    MessageCore addMessageGroups(MessageCore content, Long senderId);

    Optional<ChatCore> getChatById(Long chatId, boolean includeMessages);

    ChatCore createChat(ChatCore chat);

    //    ChatCore updateChat(ChatCore chat);
    boolean deleteChat(Long chatId);

    Optional<ChatCore> getChatByName(String chatName);

    List<ChatCore> getPublicChats();

    boolean addUserChat(Long userId, Long chatId, PermitionChat permission);

    boolean bloquearUsuarioChat(Long userId, Long chatId);

    boolean banirUsuarioChat(Long userId, Long chatId);
}
