package com.transcender.main.domain.entity;

import com.transcender.main.domain.enuns.ChatType;
import com.transcender.main.domain.exceptions.ChatArgumentInvalid;
import com.transcender.main.domain.valueobject.CreateChatDto;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class ChatCore {
    private Long id;
    private String chatName;
    private UserCore chatOwner;
    private ChatType type;
    private String descricao;
    private String password;
    private Set<Long> adms;

    private List<ChatUserCore> usuarios;
    private List<MessageCore> messages;

    private Instant criadoEm;
    private Instant atualizadoEm;


    // Construtor de criação com validações e inicialização de admins
    public ChatCore(CreateChatDto chatCreateDto) {
        this.chatName = chatCreateDto.getChatName();
        this.chatOwner = chatCreateDto.getChatOwner();
        this.type = chatCreateDto.getChatType();
        this.descricao = chatCreateDto.getDescricao();
        this.password = chatCreateDto.getPassword();
    }

    // Construtor restrito para reconstrução a partir do banco de dados
    public ChatCore(Long id, String chatName, UserCore chatOwner, ChatType type, String descricao,
                    String password, Set<Long> adms, List<MessageCore> messages, List<ChatUserCore> usuarios,
                    Instant criadoEm, Instant atualizadoEm) {
        if (id == null || id <= 0) {
            throw new ChatArgumentInvalid("Id inválido");
        }

        this.id = id;
        this.chatName = chatName;
        this.chatOwner = chatOwner;
        this.password = password;
        this.type = type;
        this.messages = messages;
        this.descricao = descricao;

        this.adms = adms != null ? adms : new HashSet<>();
        this.usuarios = usuarios;

        this.criadoEm = criadoEm;
        this.atualizadoEm = atualizadoEm;
    }


    public void validateCreateChat() {
        if (chatName == null || chatName.trim().isEmpty()) {
            throw new ChatArgumentInvalid("Nome do chat não pode estar vazio");
        }
        if (chatName.length() > 10) {
            throw new ChatArgumentInvalid("Nome do chat deve ter no máximo 10 caracteres");
        }

        if (descricao != null && descricao.length() > 100) {
            throw new ChatArgumentInvalid("Descrição deve ter no máximo 100 caracteres");
        }

        String typeStr = type.name();
        if (!"PUBLIC".equals(typeStr) && !"PROTECT".equals(typeStr) && !"PRIVATE".equals(typeStr)) {
            throw new ChatArgumentInvalid("Tipo de chat inválido");
        }
        if (chatOwner == null || chatOwner.getId() <= 0) {
            throw new ChatArgumentInvalid("Id do proprietário inválido");
        }

        if ("PROTECT".equals(typeStr) && password.isBlank()) {
            throw new ChatArgumentInvalid("Chats protegidos devem possuir senha. Campo password empty");
        }
    }

    public void validateUpdateChat(Long solicitanteId) {
        if (solicitanteId == null || solicitanteId <= 0) throw new ChatArgumentInvalid("ID do solicitante inválido");
        hasPermissionUpdate(solicitanteId);
        this.criadoEm = null;
    }

    public void hasPermissionUpdate(Long solicitanteId) {
        if (!verificarProprietario(solicitanteId) && !verificarAdm(solicitanteId)) {
            throw new ChatArgumentInvalid("Usuário não possui permissão para atualizar o chat");
        }
    }

    public boolean verificarProprietario(Long solicitanteId) {
        return chatOwner.equals(solicitanteId);
    }

    public boolean verificarAdm(Long solicitanteId) {
        return adms.contains(solicitanteId);
    }

    public void updateChatName(String novoNome) {
        if (novoNome == null || novoNome.trim().isEmpty()) {
            throw new ChatArgumentInvalid("Nome do chat não pode estar vazio");
        }
        if (novoNome.length() > 10) {
            throw new ChatArgumentInvalid("Nome do chat deve ter no máximo 10 caracteres");
        }
        this.chatName = novoNome;
        this.atualizadoEm = Instant.now();
    }

    public void updateDescricao(String novaDescricao) {
        if (novaDescricao != null && novaDescricao.length() > 100) {
            throw new ChatArgumentInvalid("Descrição deve ter no máximo 100 caracteres");
        }
        this.descricao = novaDescricao;
        this.atualizadoEm = Instant.now();
    }

    public void updateType(ChatType novoTipo) {
        if ((novoTipo != ChatType.PRIVATE) && (novoTipo != ChatType.PROTECT) && (novoTipo != ChatType.PUBLIC)) {
            throw new ChatArgumentInvalid("Tipo de chat inválido");
        }
        this.type = novoTipo;
        this.atualizadoEm = Instant.now();
    }

    public void addAdm(Long userId) {
        if (userId == null || userId <= 0) {
            throw new ChatArgumentInvalid("ID de admin inválido");
        }
        this.adms.add(userId);
        this.atualizadoEm = Instant.now();
    }

    public void removeAdm(Long userId) {
        this.adms.remove(userId);
        this.atualizadoEm = Instant.now();
    }

    @Override
    public String toString() {
        return "ChatCore{" +
                "id=" + id +
                ", chatName='" + chatName + '\'' +
                ", chatOwner=" + chatOwner +
                ", adms=" + adms +
                ", type=" + type +
                ", descricao='" + descricao + '\'' +
                ", criadoEm=" + criadoEm +
                ", atualizadoEm=" + atualizadoEm +
                '}';
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getChatName() {
        return chatName;
    }

    public UserCore getChatOwner() {
        return chatOwner;
    }

    public Set<Long> getAdms() {
        return new HashSet<>(adms); // retornando cópia defensiva
    }

    public ChatType getType() {
        return type;
    }

    public List<ChatUserCore> getUsuarios() {
        return usuarios;
    }

    public String getDescricao() {
        return descricao;
    }

    public Instant getCriadoEm() {
        return criadoEm;
    }

    public Instant getAtualizadoEm() {
        return atualizadoEm;
    }

    public String getPassword() {
        return password;
    }

    public List<MessageCore> getMessagens() {
        return messages;
    }
}
