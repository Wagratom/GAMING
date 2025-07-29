package com.transcender.main.adapters.out.jpa.entity;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ChatUsuarioIdJpa implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long chatId;
    private Long usuarioId;

    public ChatUsuarioIdJpa() {}

    public ChatUsuarioIdJpa(Long chatId, Long usuarioId) {
        this.chatId = chatId;
        this.usuarioId = usuarioId;
    }

    public Long getChatId() {
        return chatId;
    }

    public void setChatId(Long chatId) {
        this.chatId = chatId;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ChatUsuarioIdJpa)) return false;
        ChatUsuarioIdJpa that = (ChatUsuarioIdJpa) o;
        return Objects.equals(getChatId(), that.getChatId()) &&
                Objects.equals(getUsuarioId(), that.getUsuarioId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getChatId(), getUsuarioId());
    }
}
