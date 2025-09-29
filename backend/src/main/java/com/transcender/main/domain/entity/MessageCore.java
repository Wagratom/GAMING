package com.transcender.main.domain.entity;

import com.transcender.main.domain.enuns.MessageType;
import com.transcender.main.domain.exceptions.ChatArgumentInvalid;

import java.time.Instant;

public class MessageCore {

    private Long id;
    private ChatCore chat;       // referência ao Chat
    private UserCore sender;     // usuário que enviou
    private String conteudo;   // texto da mensagem
    private MessageType tipo;
    private boolean editado;
    private boolean deletado;// TEXT, IMAGE, FILE, SYSTEM...
    private Instant criadoEm;
    private Instant atualizadoEm;


    // Construtor de criação
    public MessageCore(ChatCore chat, UserCore sender, String conteudo, MessageType tipo) {
        if (chat == null) {
            throw new ChatArgumentInvalid("chat nulo");
        }

        if (conteudo == null || conteudo.trim().isEmpty()) {
            throw new ChatArgumentInvalid("Conteúdo da mensagem não pode estar vazio");
        }

        this.chat = chat;
        this.sender = sender;
        this.conteudo = conteudo;
        this.tipo = tipo != null ? tipo : MessageType.TEXT;
        this.criadoEm = Instant.now();
        this.atualizadoEm = Instant.now();
        this.editado = false;
        this.deletado = false;
    }

    // Construtor de reconstrução (ex: banco de dados)
    public MessageCore(Long id, ChatCore chat, UserCore senderId, String conteudo,
                       MessageType tipo, Instant criadoEm, Instant atualizadoEm,
                       boolean editado, boolean deletado) {
        if (id == null || id <= 0) throw new ChatArgumentInvalid("Id inválido");
        this.id = id;
        this.chat = chat;
        this.sender = senderId;
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

    public ChatCore getChat() {
        return chat;
    }

    public UserCore getSender() {
        return sender;
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
}
