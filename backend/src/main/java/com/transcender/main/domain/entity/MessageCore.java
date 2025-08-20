package com.transcender.main.domain.entity;

import com.transcender.main.domain.enuns.MessageType;
import com.transcender.main.domain.exceptions.ChatArgumentInvalid;

import java.time.Instant;

public class MessageCore {

    private Long id;
    private Long chatId;       // referência ao Chat
    private Long senderId;     // usuário que enviou
    private String conteudo;   // texto da mensagem
    private MessageType tipo;  // TEXT, IMAGE, FILE, SYSTEM...
    private Instant criadoEm;
    private Instant atualizadoEm;
    private boolean editado;
    private boolean deletado;

    // Construtor de criação
    public MessageCore(Long chatId, Long senderId, String conteudo, MessageType tipo) {
        if (chatId == null || chatId <= 0) {
            throw new ChatArgumentInvalid("ChatId inválido");
        }
        if (senderId == null || senderId <= 0) {
            throw new ChatArgumentInvalid("SenderId inválido");
        }
        if (conteudo == null || conteudo.trim().isEmpty()) {
            throw new ChatArgumentInvalid("Conteúdo da mensagem não pode estar vazio");
        }

        this.chatId = chatId;
        this.senderId = senderId;
        this.conteudo = conteudo;
        this.tipo = tipo != null ? tipo : MessageType.TEXT;
        this.criadoEm = Instant.now();
        this.atualizadoEm = Instant.now();
        this.editado = false;
        this.deletado = false;
    }

    // Construtor de reconstrução (ex: banco de dados)
    public MessageCore(Long id, Long chatId, Long senderId, String conteudo,
                       MessageType tipo, Instant criadoEm, Instant atualizadoEm,
                       boolean editado, boolean deletado) {
        if (id == null || id <= 0) throw new ChatArgumentInvalid("Id inválido");
        this.id = id;
        this.chatId = chatId;
        this.senderId = senderId;
        this.conteudo = conteudo;
        this.tipo = tipo;
        this.criadoEm = criadoEm;
        this.atualizadoEm = atualizadoEm;
        this.editado = editado;
        this.deletado = deletado;
    }

    // Regras de negócio
    public void editarConteudo(String novoConteudo) {
        if (novoConteudo == null || novoConteudo.trim().isEmpty()) {
            throw new ChatArgumentInvalid("Conteúdo não pode estar vazio");
        }
        this.conteudo = novoConteudo;
        this.editado = true;
        this.atualizadoEm = Instant.now();
    }

    public void deletarMensagem() {
        this.deletado = true;
        this.atualizadoEm = Instant.now();
    }

    // Getters
    public Long getId() {
        return id;
    }

    public Long getChatId() {
        return chatId;
    }

    public Long getSenderId() {
        return senderId;
    }

    public String getConteudo() {
        return conteudo;
    }

    public MessageType getTipo() {
        return tipo;
    }

    public Instant getCriadoEm() {
        return criadoEm;
    }

    public Instant getAtualizadoEm() {
        return atualizadoEm;
    }

    public boolean isEditado() {
        return editado;
    }

    public boolean isDeletado() {
        return deletado;
    }

    @Override
    public String toString() {
        return "MessageCore{" +
                "id=" + id +
                ", chatId=" + chatId +
                ", senderId=" + senderId +
                ", conteudo='" + conteudo + '\'' +
                ", tipo=" + tipo +
                ", criadoEm=" + criadoEm +
                ", atualizadoEm=" + atualizadoEm +
                ", editado=" + editado +
                ", deletado=" + deletado +
                '}';
    }
}
