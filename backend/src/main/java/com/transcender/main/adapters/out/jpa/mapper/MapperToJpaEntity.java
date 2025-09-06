package com.transcender.main.adapters.out.jpa.mapper;

import com.transcender.main.adapters.out.jpa.entity.*;
import com.transcender.main.domain.entity.*;
import com.transcender.main.domain.enuns.ChatType;
import com.transcender.main.domain.enuns.PermitionChat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class MapperToJpaEntity {
    private final Logger logger = LoggerFactory.getLogger(MapperToJpaEntity.class);

    public UserCore toUserCore(UserCoreJpa user, boolean includeFriends, boolean includePatys) {
        logger.info("ChatRepositoryAdapter::toUserCore::exec");

        Set<FriendCore> solicitates = includeFriends
                ? user.getSolicitadas().stream().map(this::toFriendCore).collect(Collectors.toSet())
                : Set.of();

        Set<FriendCore> receives = includeFriends
                ? user.getRecebidas().stream().map(this::toFriendCore).collect(Collectors.toSet())
                : Set.of();

        List<MatchCore> partidasComoUsuario1 = includePatys
                ? user.getPartidasVencidas().stream().map(this::toPartidaCore).collect(Collectors.toUnmodifiableList()) : null;
        List<MatchCore> partidasComoUsuario2 = includePatys
                ? user.getPartidasPerdidas().stream().map(this::toPartidaCore).collect(Collectors.toUnmodifiableList()) : null;
        List<MatchCore> partidasVencidas = includePatys
                ? user.getPartidasVencidas().stream().map(this::toPartidaCore).collect(Collectors.toUnmodifiableList()) : null;

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
                partidasComoUsuario1,
                partidasComoUsuario2,
                partidasVencidas,
                user.getCriadoEm(),
                user.getAtualizadoEm()
        );
    }

    public MatchCore toPartidaCore(MatchCoreJpa match) {
        logger.info("MapperToJpaEntity > toPartidaCore > exec, partidaId={}", match.getId());

        return new MatchCore(
                match.getId(),
                match.getMap(),
                toUserCore(match.getWinner(), false, false),
                toUserCore(match.getLoser(), false, false),
                match.getWinnerScore(),
                match.getLoserScore(),
                match.getCriadoEm(),
                match.getAtauzalidoEm()
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
                user.getCriadoEm(),
                user.getAtualizadoEm()
        );
    }

    public FriendCore toFriendCore(FriendCoreJpa friendjpa) {
        logger.info("ChatRepositoryAdapter::toFriendCore::exec");

        return new FriendCore(
                friendjpa.getId(),
                toUserCore(friendjpa.getUsuario1(), false, false),
                toUserCore(friendjpa.getUsuario2(), false, false),
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
        chatJpa.setOwner(owner);
        chatJpa.setDescricao(chat.getDescricao());
        chatJpa.setCriadoEm(chat.getCriadoEm());
        chatJpa.setAtualizadoEm(chat.getAtualizadoEm());
        return chatJpa;
    }

    public ChatCore toChatCore(ChatCoreJpa chatJpa) {
        logger.info("transformando em uma entity da aplicação, chatid={}", chatJpa.getId());
        boolean isPrivate = chatJpa.getType() == ChatType.PRIVATE;

        Set<Long> adms = isPrivate
                ? Collections.emptySet()
                : chatJpa.getUsuarios().stream()
                .filter(u -> u.getPermitionChat() == PermitionChat.ADM)
                .map(u -> u.getUsuario().getId())
                .collect(Collectors.toSet());

        Long ownerId = isPrivate ? null : chatJpa.getOwner().getId();

        List<MessageCore> mensagens = Optional.ofNullable(chatJpa.getMensagens())
                .orElse(Collections.emptyList())
                .stream()
                .map(this::toMessageCore)
                .collect(Collectors.toList());

        return new ChatCore(
                chatJpa.getId(),
                chatJpa.getChatName(),
                ownerId,
                chatJpa.getType(),
                chatJpa.getDescricao(),
                adms,
                mensagens,
                chatJpa.getCriadoEm(),
                chatJpa.getAtualizadoEm()
        );
    }


    public MessageCore toMessageCore(MessageCoreJpa messagesJpa) {
        logger.info("ChatRepositoryAdapter::toMessageCore::exec");

        return new MessageCore(
                messagesJpa.getId(),
                messagesJpa.getChat().getId(),
                toUserCore(messagesJpa.getSender(), false, false),
                messagesJpa.getConteudo(),
                messagesJpa.getTipo(),
                messagesJpa.getCriadoEm(),
                messagesJpa.getAtualizadoEm(),
                messagesJpa.isEditado(),
                messagesJpa.isDeletado()
        );
    }
}
