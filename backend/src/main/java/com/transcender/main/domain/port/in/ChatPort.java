package com.transcender.main.domain.port.in;

import com.transcender.main.domain.entity.ChatCore;
import com.transcender.main.domain.entity.UserCore;

import java.util.List;
import java.util.Map;

public interface ChatPort {
    ChatCore getMessagensDirectChat(String jwt, Long friendId);
    Map<String, Object> postMessagensDirectChat(String jwt, Long friendId);

    ChatCore createChat(ChatCore chat);
    ChatCore updateChat(ChatCore user, Long solicitanteId);
    boolean deleteChat(Long chatId, Long userId);

    List<ChatCore> getAllChats();
    boolean addUsuarioChat(Long chatId, UserCore usuario);
    boolean bloquearUsuarioChat(Long chatId, UserCore usuario);
    boolean banirUsuarioChat(Long chatId, UserCore usuario);
}
