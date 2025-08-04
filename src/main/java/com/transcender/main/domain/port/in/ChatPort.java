package com.transcender.main.domain.port.in;

import com.transcender.main.domain.entity.ChatCore;
import com.transcender.main.domain.entity.UserCore;

import java.util.List;

public interface ChatPort {
    ChatCore getChat(Long chatID);
    ChatCore createChat(ChatCore chart);
    ChatCore updateChat(ChatCore user, Long solicitanteId);
    boolean deleteChat(Long chatId, Long userId);

    List<ChatCore> getAllChats();
    boolean addUsuarioChat(Long chatId, UserCore usuario);
    boolean bloquearUsuarioChat(Long chatId, UserCore usuario);
    boolean banirUsuarioChat(Long chatId, UserCore usuario);
}
