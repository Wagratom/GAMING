package com.transcender.main.adapters.out.jpa;

import com.transcender.main.adapters.out.jpa.entity.ChatCoreJpa;
import com.transcender.main.adapters.out.jpa.entity.UserCoreJpa;
import com.transcender.main.adapters.out.jpa.repository.ChatRepository;
import com.transcender.main.adapters.out.jpa.repository.UserRepository;
import com.transcender.main.domain.Entity.ChatCore;
import com.transcender.main.domain.enuns.ChatType;
import com.transcender.main.domain.enuns.PermitionChat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class ChatRepositoryAdapter implements com.transcender.main.domain.port.out.ChatRepository {
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;

    @Autowired
    ChatRepositoryAdapter(ChatRepository chatRepository, UserRepository userRepository) {
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Optional<ChatCore> findChatById(Long id) {
       return chatRepository.findById(id).map(this::toChatCore);
    }

    @Override
    public ChatCore createChat(ChatCore chat) {
        ChatCoreJpa chatJpa = chatRepository.save(toChatCoreJpa(chat));
        return toChatCore(chatJpa); // toChatCore que recebe diretamente o objeto, não Optional
    }


    @Override
    public ChatCore updateChat(ChatCore chat) {
        ChatCoreJpa chatJpa = chatRepository.save(toChatCoreJpa(chat));

        return toChatCore(chatJpa);
    }

    @Override
    public boolean deleteChat(Long chatId) {
        try {
            chatRepository.deleteById(chatId);
            return true;
        } catch (Exception err) {
            return false;
        }
    }

    @Override
    public List<ChatCore> getAllChats() {
        return chatRepository.findAll()
                .stream()
                .map(this::toChatCore)
                .collect(Collectors.toList());
    }

    @Override
    public boolean addUserChat(Long userId, Long chatId) {
        return false;
    }

    @Override
    public boolean bloquearUsuarioChat(Long userId, Long chatId) {
        return false;
    }

    @Override
    public boolean banirUsuarioChat(Long userId, Long chatId) {
        return false;
    }

    public ChatCoreJpa toChatCoreJpa(ChatCore chat) {
        UserCoreJpa owner = userRepository.findById(chat.getChatOwner()).orElseThrow(() -> new RuntimeException("error"));
        ChatCoreJpa chatJpa = new ChatCoreJpa();
        chatJpa.setId(chat.getId());
        chatJpa.setChatName(chat.getChatName());
        chatJpa.setOnwer(owner);
        chatJpa.setDescricao(chat.getDescricao());
        chatJpa.setCriadoEm(chat.getCriadoEm());
        chatJpa.setAtualizadoEm(chat.getAtualizadoEm());
        return chatJpa;
    }

    public ChatCore toChatCore(ChatCoreJpa chatJpa) {
        Long id = chatJpa.getId();
        String chatName = chatJpa.getChatName();
        Long chatOwnerId = chatJpa.getOnwer().getId(); // conversão de entidade para ID
        ChatType type = chatJpa.getType(); // enum → string
        String descricao = chatJpa.getDescricao();
        Instant criadoEm = chatJpa.getCriadoEm();
        Instant atualizadoEm = chatJpa.getAtualizadoEm();

        // Filtra usuários com permissão de ADMIN
        Set<Long> adms = chatJpa.getUsuarios().stream()
                .filter(u -> u.getPermitionChat() == PermitionChat.ADM)
                .map(u -> u.getUsuario().getId())
                .collect(Collectors.toSet());

        return new ChatCore(
                id,
                chatName,
                chatOwnerId,
                type,
                descricao,
                criadoEm,
                atualizadoEm,
                adms
        );
    }

}
