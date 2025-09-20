package com.transcender.main.domain.valueobject;

import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.enuns.ChatType;
import com.transcender.main.domain.exceptions.BadRequest;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class CreateChatDto {
    private final String chatName;
    private final String descricao;
    private final ChatType type;
    private UserCore chatOwner;
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

    public UserCore getChatOwner() {
        return chatOwner;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setOwner(UserCore ownerId) {
        this.chatOwner = ownerId;
    }

    public void validateChat() {
        if (type.equals(ChatType.PROTECT) && password.isBlank()) throw new BadRequest("Chat protegido deve ter senha");
        if ((type.equals(ChatType.PROTECT) || type.equals(ChatType.PUBLIC)) && chatOwner == null) {
            throw new BadRequest("O chat não possui um owner");
        }
    }
}
