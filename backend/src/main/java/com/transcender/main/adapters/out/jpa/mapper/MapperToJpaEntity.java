package com.transcender.main.adapters.out.jpa.mapper;

import com.transcender.main.adapters.out.jpa.entity.ChatCoreJpa;
import com.transcender.main.adapters.out.jpa.entity.FriendCoreJpa;
import com.transcender.main.adapters.out.jpa.entity.MessageCoreJpa;
import com.transcender.main.adapters.out.jpa.entity.UserCoreJpa;
import com.transcender.main.domain.entity.ChatCore;
import com.transcender.main.domain.entity.FriendCore;
import com.transcender.main.domain.entity.MessageCore;
import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.enuns.ChatType;
import com.transcender.main.domain.enuns.PermitionChat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class MapperToJpaEntity {
    private final Logger logger = LoggerFactory.getLogger(MapperToJpaEntity.class);

    public UserCore toUserCore(UserCoreJpa user, boolean includeFriends) {
        logger.info("ChatRepositoryAdapter::toUserCore::exec");

        Set<FriendCore> solicitates = includeFriends
                ? user.getSolicitadas().stream().map(this::toFriendCore).collect(Collectors.toSet())
                : Set.of();

        Set<FriendCore> receives = includeFriends
                ? user.getRecebidas().stream().map(this::toFriendCore).collect(Collectors.toSet())
                : Set.of();

        return new UserCore(
                user.getId(),
                user.getEmail(),
                user.getSenhaHash(),
                user.getNickname(),
                user.getTelefone(),
                user.getOnline(),
                user.getAtive(),
                solicitates,
                receives,
                user.getCriadoEm(),
                user.getAtualizadoEm()
        );
    }

    public UserCoreJpa toUserCoreJpa(UserCore user) {
        logger.info("ChatRepositoryAdapter::toUserCoreJpa::exec");

        return new UserCoreJpa(
                user.getId(),
                user.getEmail(),
                user.getSenhaHash(),
                user.getNickname(),
                user.getTelefone(),
                user.getOnline(),
                user.getAtive(),
                null,
                null,
                null,
                null,
                user.getCriadoEm(),
                user.getAtualizadoEm()
        );
    }

    public FriendCore toFriendCore(FriendCoreJpa friendjpa) {
        logger.info("ChatRepositoryAdapter::toFriendCore::exec");

        return new FriendCore(
                friendjpa.getId(),
                toUserCore(friendjpa.getUsuario1(), false),
                toUserCore(friendjpa.getUsuario2(), false)
                ,
                friendjpa.getStatus(),
                friendjpa.getCriadoEm(),
                friendjpa.getAtualizadoEm()
        );
    }

    public ChatCoreJpa toChatCoreJpa(ChatCore chat, UserCoreJpa owner) {
        logger.info("ChatRepositoryAdapter::toChatCoreJpa::exec");

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
        logger.info("ChatRepositoryAdapter::toChatCore::exec");

        Set<Long> adms = chatJpa.getUsuarios()
                .stream()
                .filter(u -> u.getPermitionChat() == PermitionChat.ADM)
                .map(u -> u.getUsuario().getId())
                .collect(Collectors.toSet());

        Long userId = chatJpa.getType() == ChatType.PRIVATE ? null :  chatJpa.getOnwer().getId();

        return new ChatCore(
                chatJpa.getId(),
                chatJpa.getChatName(),
                userId,
                chatJpa.getType(),
                chatJpa.getDescricao(),
                adms,
                chatJpa.getMensagens()
                        .stream()
                        .map((msg) -> toMessageCore(msg))
                        .collect(Collectors.toList()),
                chatJpa.getCriadoEm(),
                chatJpa.getAtualizadoEm()
        );
    }

    public MessageCore toMessageCore(MessageCoreJpa messagesJpa) {
        logger.info("ChatRepositoryAdapter::toMessageCore::exec");

        return new MessageCore(
                messagesJpa.getId(),
                messagesJpa.getChat().getId(),
                toUserCore(messagesJpa.getSender(), false),
                messagesJpa.getConteudo(),
                messagesJpa.getTipo(),
                messagesJpa.getCriadoEm(),
                messagesJpa.getAtualizadoEm(),
                messagesJpa.isEditado(),
                messagesJpa.isDeletado()
        );
    }
}
