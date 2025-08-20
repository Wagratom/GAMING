package com.transcender.main.adapters.out.jpa.entity;

import java.io.Serializable;
import java.util.Objects;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Embeddable
public class ChatUserIdJpa implements Serializable {

    private Long chat;
    private Long usuario;

    public ChatUserIdJpa() {}

    public ChatUserIdJpa(Long chat, Long usuario) {
        this.chat = chat;
        this.usuario = usuario;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ChatUserIdJpa)) return false;
        ChatUserIdJpa that = (ChatUserIdJpa) o;
        return Objects.equals(chat, that.chat) &&
                Objects.equals(usuario, that.usuario);
    }

    @Override
    public int hashCode() {
        return Objects.hash(chat, usuario);
    }
}
