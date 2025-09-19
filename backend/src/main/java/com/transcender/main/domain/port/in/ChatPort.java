package com.transcender.main.domain.port.in;

import com.transcender.main.domain.entity.ChatCore;
import com.transcender.main.domain.entity.MessageCore;
import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.valueobject.CreateChatDto;

import java.util.List;
import java.util.Map;

public interface ChatPort {
    ChatCore getDirectChat(String jwt, Long friendId);
    void postDirectChat(String jwt, Long friendId, String content);

    ChatCore createChat(CreateChatDto chat, String jwt);
//    ChatCore updateChat(ChatCore user, Long solicitanteId);
    boolean deleteChat(Long chatId, Long userId);

    List<ChatCore> getPublicsChats(String jwt);
    boolean addUsuarioChat(Long chatId, UserCore usuario);
    boolean bloquearUsuarioChat(Long chatId, UserCore usuario);
    boolean banirUsuarioChat(Long chatId, UserCore usuario);
}
