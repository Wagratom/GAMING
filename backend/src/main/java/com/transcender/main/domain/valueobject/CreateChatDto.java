package com.transcender.main.domain.valueobject;

import com.transcender.main.domain.enuns.ChatType;
import com.transcender.main.domain.exceptions.BadRequest;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;

@AllArgsConstructor
public class CreateChatDto {
    private final String chatName;
    private final String descricao;
    private final ChatType type;
    private final Long chatOwner;
    private String password;

    public String getChatName() {
        return chatName;
    }

    public String getDescricao() {
        return descricao;
    }

    public ChatType getChatType() {
        return type;
    }

    public Long getChatOwner() {
        return chatOwner;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void validateChat() {
        if (type.name().equals("PROTECT") && password.isBlank()) throw new BadRequest("Chat protegido deve ter senha");
    }
}
