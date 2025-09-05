package com.transcender.main.adapters.out.jpa;

import com.transcender.main.adapters.out.jpa.entity.ChatCoreJpa;
import com.transcender.main.adapters.out.jpa.entity.ChatUserCoreJpa;
import com.transcender.main.adapters.out.jpa.entity.MessageCoreJpa;
import com.transcender.main.adapters.out.jpa.entity.UserCoreJpa;
import com.transcender.main.adapters.out.jpa.mapper.MapperToJpaEntity;
import com.transcender.main.adapters.out.jpa.repository.ChatRepository;
import com.transcender.main.adapters.out.jpa.repository.ChatUserRepository;
import com.transcender.main.adapters.out.jpa.repository.MessageRepository;
import com.transcender.main.adapters.out.jpa.repository.UserRepository;
import com.transcender.main.domain.entity.ChatCore;
import com.transcender.main.domain.entity.MessageCore;
import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.enuns.MessageType;
import com.transcender.main.domain.enuns.PermitionChat;
import com.transcender.main.domain.enuns.StatusChat;
import com.transcender.main.domain.port.out.ChatRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ChatRepositoryAdapter implements ChatRepositoryPort {
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;
    private final MapperToJpaEntity mapperToJpaEntity;
    private final MessageRepository messageRepository;
    private final ChatUserRepository chatUserRepository;
    private final Logger logger = LoggerFactory.getLogger(UserRepositoryAdapter.class);

    public ChatCoreJpa createDirectChat(UserCoreJpa user1, UserCoreJpa user2) {
        ChatCoreJpa privateChat = ChatCoreJpa.newPrivateChat();
        privateChat = chatRepository.save(privateChat);

        ChatUserCoreJpa chatUser1 = new ChatUserCoreJpa(
                privateChat, user1, StatusChat.ATIVE, PermitionChat.MEMBER, Instant.now(), null
        );
        ChatUserCoreJpa chatUser2 = new ChatUserCoreJpa(
                privateChat, user2, StatusChat.ATIVE, PermitionChat.MEMBER, Instant.now(), null
        );

        // 3. Salva os vínculos
        chatUserRepository.save(chatUser1);
        chatUserRepository.save(chatUser2);

        return privateChat;
    }

    @Override
    public ChatCore getOrCreateDirectChat(UserCore user1, UserCore user2) {
        var ids = List.of(user1.getId(), user2.getId());
        logger.info("Get direct chat | IDS={}", ids);
        ChatCoreJpa chatCoreJpa = chatRepository
                .findPrivateChatBetweenUsers(ids, ids.size())
                .orElseGet(() -> createDirectChat(
                        mapperToJpaEntity.toUserCoreJpa(user1),
                        mapperToJpaEntity.toUserCoreJpa(user2)
                ));

        return mapperToJpaEntity.toChatCore(chatCoreJpa);
    }

    @Override
    public MessageCore addNewMessageDirectChat(UserCore sender, UserCore friend, String content) {
        var ids = List.of(sender.getId(), friend.getId());
        logger.info("add new message direct chat | IDS={}", ids);
        ChatCoreJpa directChat = mapperToJpaEntity.toChatCoreJpa(getOrCreateDirectChat(sender, friend), null);

        MessageCoreJpa mensagem = messageRepository.save(new MessageCoreJpa(
                directChat,
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
        chatJpa.setOwner(owner);
        chatJpa.setDescricao(chat.getDescricao());
        chatJpa.setCriadoEm(chat.getCriadoEm());
        chatJpa.setAtualizadoEm(chat.getAtualizadoEm());
        return chatJpa;
    }
}
