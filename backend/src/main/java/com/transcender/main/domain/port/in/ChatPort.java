package com.transcender.main.domain.port.in;

import com.transcender.main.domain.entity.ChatCore;
import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.valueobject.CreateChatDto;

import java.util.List;

public interface ChatPort {
    ChatCore getDirectChat(String jwt, Long friendId);

    void addMessageDirectChat(String jwt, Long friendId, String content);

    ChatCore createChat(CreateChatDto chat, String jwt);

    List<ChatCore> getPublicsChats(String jwt);

    ChatCore openChat(String jwt, String chatName, String password);

    ChatCore getGroupChatById(String jwt, Long chatId);


    boolean deleteChat(Long chatId, Long userId);

    boolean addUsuarioChat(Long chatId, UserCore usuario);

    boolean bloquearUsuarioChat(Long chatId, UserCore usuario);

    boolean banirUsuarioChat(Long chatId, UserCore usuario);
}
