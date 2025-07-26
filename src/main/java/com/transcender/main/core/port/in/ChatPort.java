package com.transcender.main.core.port.in;

import com.transcender.main.core.Entity.ChatCore;
import com.transcender.main.core.Entity.UsuarioCore;

public interface ChatPort {
    void getChat(Long chatID);
    void createChat(ChatCore chart);
    void deletarChat(UsuarioCore user);
    void updateChat(UsuarioCore user);


    void addUsuarioChat(Long chatId, UsuarioCore usuario);
    void bloquearUsuarioChat(Long chatId, UsuarioCore usuario);
    void banirUsuarioChat(Long chatId, UsuarioCore usuario);
}
