package com.transcender.main.adapters.out.jpa;

import com.transcender.main.adapters.out.jpa.entity.ChatCoreJpa;
import com.transcender.main.adapters.out.jpa.entity.ChatUserCoreJpa;
import com.transcender.main.adapters.out.jpa.entity.MessageCoreJpa;
import com.transcender.main.adapters.out.jpa.entity.UserCoreJpa;
import com.transcender.main.adapters.out.jpa.mapper.MapperToJpaEntity;
import com.transcender.main.adapters.out.jpa.repository.ChatRepository;
import com.transcender.main.adapters.out.jpa.repository.ChatUserRepository;
import com.transcender.main.adapters.out.jpa.repository.UserRepository;
import com.transcender.main.domain.entity.ChatCore;
import com.transcender.main.domain.entity.MessageCore;
import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.enuns.ChatType;
import com.transcender.main.domain.enuns.MessageType;
import com.transcender.main.domain.enuns.PermitionChat;
import com.transcender.main.domain.enuns.StatusChat;
import com.transcender.main.domain.port.out.ChatRepositoryPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class ChatRepositoryAdapter implements ChatRepositoryPort {
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final ChatUserRepository chatUserRepository;
    private final MapperToJpaEntity mapperToJpaEntity;
    private final Logger logger = LoggerFactory.getLogger(UserRepositoryAdapter.class);

    @Autowired
    public ChatRepositoryAdapter(ChatRepository chatRepository,
                                 UserRepository userRepository,
                                 ChatUserRepository chatUserRepository,
                                 MapperToJpaEntity mapperToJpaEntit) {
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
        this.chatUserRepository = chatUserRepository;
        this.mapperToJpaEntity = mapperToJpaEntit;
    }

    @Override
    public Optional<ChatCore> findDirectChatByUsers(Long userId, Long friendId) {
        return chatRepository.findPrivateChatBetweenUsers(List.of(userId, friendId)).map(this::toChatCore);
    }

    @Override
    public ChatCore createDirectChat(UserCore user, UserCore friend) {
        ChatCoreJpa newChat = chatRepository.save(ChatCoreJpa.newPrivateChat());
        chatUserRepository.save(new ChatUserCoreJpa(
                newChat,
                mapperToJpaEntity.toUserCoreJpa(user),
                StatusChat.ATIVE,
                PermitionChat.MEMBER,
                Instant.now(),
                Instant.now()
        ));

        chatUserRepository.save(new ChatUserCoreJpa(
                newChat,
                mapperToJpaEntity.toUserCoreJpa(friend),
                StatusChat.ATIVE,
                PermitionChat.MEMBER,
                Instant.now(),
                Instant.now()
        ));

        return toChatCore(newChat);
    }

    @Override
    public Optional<ChatCore> findChatById(Long id) {
        return chatRepository.findById(id).map(this::toChatCore);
    }

    @Override
    public ChatCore createChat(ChatCore chat) {
        logger.info("ChatRepositoryAdapter > createChat > exec");

        ChatCoreJpa chatJpa = chatRepository.save(toChatCoreJpa(chat));
        return toChatCore(chatJpa); // toChatCore que recebe diretamente o objeto, não Optional
    }


    @Override
    public ChatCore updateChat(ChatCore chat) {
        logger.info("ChatRepositoryAdapter > updateChat > exec");

        ChatCoreJpa chatJpa = chatRepository.save(toChatCoreJpa(chat));
        return toChatCore(chatJpa);
    }

    @Override
    public boolean deleteChat(Long chatId) {
        logger.info("ChatRepositoryAdapter > deleteChat > exec");

        try {
            chatRepository.deleteById(chatId);
            return true;
        } catch (Exception err) {
            return false;
        }
    }

    @Override
    public List<ChatCore> getAllChats() {
        logger.info("ChatRepositoryAdapter > getAllChats > exec");

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
        List<MessageCoreJpa> messages = chatJpa.getMensagens();

        // Filtra usuários com permissão de ADMIN
        Set<Long> adms = chatJpa.getUsuarios().stream()
                .filter(u -> u.getPermitionChat() == PermitionChat.ADM)
                .map(u -> u.getUsuario().getId())
                .collect(Collectors.toSet());

        return new ChatCore(
                chatJpa.getId(),
                chatJpa.getChatName(),
                chatJpa.getOnwer().getId(),
                chatJpa.getType(),
                chatJpa.getDescricao(),
                adms,
                chatJpa.getMensagens().stream().map(this::toChatCore).collect(Collectors.toList()),
                chatJpa.getCriadoEm(),
                chatJpa.getAtualizadoEm()
        );
    }


    public MessageCore toChatCore(MessageCoreJpa messagesJpa) {
        return new MessageCore(
                messagesJpa.getId(),
                messagesJpa.getChat().getId(),
                messagesJpa.getSender().getId(),
                messagesJpa.getConteudo(),
                messagesJpa.getTipo(),
                messagesJpa.getSender().getNickname(),
                messagesJpa.getCriadoEm(),
                messagesJpa.getAtualizadoEm(),
                messagesJpa.isEditado(),
                messagesJpa.isDeletado()
        );
    }

}
