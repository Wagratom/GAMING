package com.transcender.main.adapters.out.jpa;

import com.transcender.main.adapters.out.jpa.entity.ChatCoreJpa;
import com.transcender.main.adapters.out.jpa.entity.MessageCoreJpa;
import com.transcender.main.adapters.out.jpa.entity.UserCoreJpa;
import com.transcender.main.adapters.out.jpa.mapper.MapperToJpaEntity;
import com.transcender.main.adapters.out.jpa.repository.ChatRepository;
import com.transcender.main.adapters.out.jpa.repository.MessageRepository;
import com.transcender.main.adapters.out.jpa.repository.UserRepository;
import com.transcender.main.domain.entity.ChatCore;
import com.transcender.main.domain.entity.MessageCore;
import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.enuns.MessageType;
import com.transcender.main.domain.port.out.ChatRepositoryPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class ChatRepositoryAdapter implements ChatRepositoryPort {
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final MapperToJpaEntity mapperToJpaEntity;
    private final MessageRepository messageRepository;
    private final Logger logger = LoggerFactory.getLogger(UserRepositoryAdapter.class);

    @Autowired
    public ChatRepositoryAdapter(ChatRepository chatRepository,
                                 UserRepository userRepository,
                                 MessageRepository messageRepository,
                                 MapperToJpaEntity mapperToJpaEntiy) {
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
        this.messageRepository = messageRepository;
        this.mapperToJpaEntity = mapperToJpaEntiy;
    }

    @Override
    public ChatCore getOrCreateDirectChat(Long userId, Long friendId) {
        logger.info("ChatRepositoryAdapter::getOrCreateDirectChat > user1={}::user2={}", userId, friendId);
        ChatCoreJpa chatCoreJpa = chatRepository
                .findPrivateChatBetweenUsers(List.of(userId, friendId))
                .orElse(chatRepository.save(ChatCoreJpa.newPrivateChat()));

        return mapperToJpaEntity.toChatCore(chatCoreJpa);
    }

    @Override
    public MessageCore addNewMessageDirectChat(UserCore sender, UserCore friendId, String content) {
        ChatCoreJpa chatCoreJpa = chatRepository
                .findPrivateChatBetweenUsers(List.of(sender.getId(), friendId.getId()))
                .orElse(chatRepository.save(ChatCoreJpa.newPrivateChat()));

        MessageCoreJpa mensagem = messageRepository.save(new MessageCoreJpa(
                chatCoreJpa,
                mapperToJpaEntity.toUserCoreJpa(sender),
                content,
                MessageType.TEXT,
                false,
                false
                ));

        return mapperToJpaEntity.toMessageCore(mensagem);
    }

    @Override
    public Optional<ChatCore> findChatById(Long id) {
        return chatRepository.findById(id)
                .map((chatJpa) -> mapperToJpaEntity.toChatCore(chatJpa));
    }

    @Override
    public ChatCore createChat(ChatCore chat) {
        logger.info("ChatRepositoryAdapter > createChat > exec");

        ChatCoreJpa chatJpa = chatRepository.save(toChatCoreJpa(chat));
        return mapperToJpaEntity.toChatCore(chatJpa); // toChatCore que recebe diretamente o objeto, não Optional
    }

    @Override
    public ChatCore updateChat(ChatCore chat) {
        logger.info("ChatRepositoryAdapter > updateChat > exec");

        ChatCoreJpa chatJpa = chatRepository.save(toChatCoreJpa(chat));
        return mapperToJpaEntity.toChatCore(chatJpa);
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
                .map((chatJpa) -> mapperToJpaEntity.toChatCore(chatJpa))
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
}
