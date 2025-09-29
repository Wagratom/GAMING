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
import com.transcender.main.domain.enuns.MessageType;
import com.transcender.main.domain.enuns.PermitionChat;
import com.transcender.main.domain.enuns.StatusChat;
import com.transcender.main.domain.exceptions.ResourceNotFound;
import com.transcender.main.domain.port.out.ChatRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
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
    public ChatRepositoryPort.responsePrivateChat getOrCreateDirectChat(Long requester, Long friendId) {
        var ids = List.of(requester, friendId);
        logger.info("Get direct chat | IDS={}", ids);

        Optional<UserCoreJpa> request = userRepository.findById(requester);
        ChatCoreJpa chatCoreJpa = chatRepository
                .findPrivateChatBetweenUsers(ids, ids.size())
                .orElseGet(() -> createDirectChat(
                        request.get(),
                        userRepository.findById(friendId).orElseThrow(() -> new ResourceNotFound("User", friendId))
                ));

        return new responsePrivateChat(
                mapperToJpaEntity.toChatCore(chatCoreJpa, true),
                mapperToJpaEntity.toUserCore(request.get(), false, false)
        );
    }

    @Override
    public MessageCore addNewMessageDirectChat(ChatRepositoryPort.responsePrivateChat addMessageDto, String content) {
        logger.info("add new message do usuario {} no chat {}", addMessageDto.chat().getId(), addMessageDto.sender().getId());

        MessageCoreJpa mensagem = messageRepository.save(new MessageCoreJpa(
                toChatCoreJpa(addMessageDto.chat(), null),
                mapperToJpaEntity.toUserCoreJpa(addMessageDto.sender()),
                content,
                MessageType.TEXT,
                false,
                false
        ));

        return mapperToJpaEntity.toMessageCore(mensagem);
    }

    @Override
    public Optional<ChatCore> getChatById(Long chatId, boolean includeMessages) {
        return chatRepository.findById(chatId)
                .map((chat) -> mapperToJpaEntity.toChatCore(chat, includeMessages));
    }

    @Override
    public MessageCore addMessageGroups(MessageCore messageObj, Long senderId) {
        UserCoreJpa user = userRepository.findById(senderId).orElseThrow(() -> new ResourceNotFound("Usuario", senderId));
        MessageCoreJpa newMessage = new MessageCoreJpa(
                toChatCoreJpa(messageObj.getChat(), null),
                user,
                messageObj.getConteudo(),
                messageObj.getTipo(),
                false,
                false
        );
        messageRepository.save(newMessage);
        return mapperToJpaEntity.toMessageCore(newMessage);
    }

    @Override
    public ChatCore createChat(ChatCore chat) {
        UserCoreJpa userCoreJpa = mapperToJpaEntity.toUserCoreJpa(chat.getChatOwner());
        ChatCoreJpa chatJpa = chatRepository.save(toChatCoreJpa(chat, userCoreJpa));
        chatUserRepository.save(new ChatUserCoreJpa(
                chatJpa,
                userCoreJpa,
                StatusChat.ATIVE,
                PermitionChat.OWNER,
                Instant.now(),
                Instant.now()
        ));

        return mapperToJpaEntity.toChatCore(chatJpa, false);
    }

    @Override
    public Optional<ChatCore> getChatByName(String chatName) {
        List<ChatCoreJpa> chats = chatRepository.findByChatName(chatName);
        return chats.stream().findFirst().map((chat) -> mapperToJpaEntity.toChatCore(chat, true));
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
    public List<ChatCore> getPublicChats() {
        return chatRepository.getCreatedChats()
                .stream()
                .map((chat) -> mapperToJpaEntity.toChatCore(chat, false))
                .collect(Collectors.toList());
    }

    @Override
    public boolean addUserChat(Long userId, Long chatId, PermitionChat permission) {
        ChatCoreJpa chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new ResourceNotFound("Chat", chatId));
        UserCoreJpa user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFound("User", userId));

        ChatUserCoreJpa newChatUser = new ChatUserCoreJpa(
                chat,
                user,
                StatusChat.ATIVE, // verifique o nome correto
                permission,
                null,
                Instant.now()
        );

        List<ChatUserCoreJpa> newList = chat.getUsuarios() != null
                ? chat.getUsuarios()
                : new ArrayList<>();

        newList.add(newChatUser);
        chat.setUsuarios(newList);

        chatRepository.save(chat);
        return true;
    }

    @Override
    public boolean bloquearUsuarioChat(Long userId, Long chatId) {
        return false;
    }

    @Override
    public boolean banirUsuarioChat(Long userId, Long chatId) {
        return false;
    }

    public ChatCoreJpa toChatCoreJpa(ChatCore chat, UserCoreJpa userCore) {
        return new ChatCoreJpa(
                chat.getId(),
                chat.getChatName(),
                userCore,
                chat.getType(),
                chat.getDescricao(),
                chat.getPassword(),
                null,
                null,
                Instant.now(),
                Instant.now()
        );
    }
}
