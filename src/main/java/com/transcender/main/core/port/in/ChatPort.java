package com.transcender.main.core.port.in;

import com.transcender.main.core.Entity.ChatCore;
import com.transcender.main.core.Entity.UsuarioCore;

import java.util.List;
import java.util.Map;

public interface ChatPort {
    ChatCore getChat(Long chatID);
    ChatCore createChat(ChatCore chart);
    ChatCore updateChat(ChatCore user);
    boolean deleteChat(Long chatId, Long userId);

    List<ChatCore> getAllChats();
    boolean addUsuarioChat(Long chatId, UsuarioCore usuario);
    boolean bloquearUsuarioChat(Long chatId, UsuarioCore usuario);
    boolean banirUsuarioChat(Long chatId, UsuarioCore usuario);
}
