package com.transcender.main.domain.valueobject;

import com.transcender.main.domain.enuns.ChatType;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CreateChatDto {
    private final String chatName;
    private final String descricao;
    private final ChatType type;
    private final Long chatOwner;
    private final String password;

    public String getChatName() {
        return chatName;
    }

    public String getDescricao() {
        return descricao;
    }

    public ChatType ChatType() {
        return type;
    }

    public Long getChatOwner() {
        return chatOwner;
    }

    public String getPassword() {
        return password;
    }
}
