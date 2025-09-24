package com.transcender.main.adapters.out.jpa.mapper;

import com.transcender.main.adapters.out.jpa.entity.*;
import com.transcender.main.domain.entity.*;
import com.transcender.main.domain.enuns.PermitionChat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class MapperToJpaEntity {

    private static final Logger logger = LoggerFactory.getLogger(MapperToJpaEntity.class);

    /**
     * Conjunto de membros do chat separados por status/permissão
     */
    private static class MembersChat {
        final Set<ChatUserCore> adms = new HashSet<>();
        final Set<ChatUserCore> members = new HashSet<>();
        final Set<ChatUserCore> banned = new HashSet<>();
        final Set<ChatUserCore> kicked = new HashSet<>();
        final Set<ChatUserCore> mutted = new HashSet<>();
    }

    /* ===================== USER ===================== */

    public UserCore toUserCore(UserCoreJpa user, boolean includeFriends, boolean includeMatchs) {
        if (user == null) return null;

        logger.debug("Parser UserJpa {} -> UserCore (includeFriends={}, includeMatchs={})",
                user.getId(), includeFriends, includeMatchs);

        Set<FriendCore> solicitates = includeFriends
                ? user.getSolicitadas().stream().map(this::toFriendCore).collect(Collectors.toSet())
                : Collections.emptySet();

        Set<FriendCore> receives = includeFriends
                ? user.getRecebidas().stream().map(this::toFriendCore).collect(Collectors.toSet())
                : Collections.emptySet();

        List<MatchCore> partidasComoUsuario1 = includeMatchs
                ? user.getPartidasVencidas().stream().map(this::toPartidaCore).toList()
                : null;

        List<MatchCore> partidasComoUsuario2 = includeMatchs
                ? user.getPartidasPerdidas().stream().map(this::toPartidaCore).toList()
                : null;

        List<MatchCore> partidasVencidas = includeMatchs
                ? user.getPartidasVencidas().stream().map(this::toPartidaCore).toList()
                : null;

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

    public UserCoreJpa toUserCoreJpa(UserCore user) {
        return user == null ? null : new UserCoreJpa(
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

    public FriendCore toFriendCore(FriendCoreJpa friendJpa) {
        return friendJpa == null ? null : new FriendCore(
                friendJpa.getId(),
                toUserCore(friendJpa.getUsuario1(), false, false),
                toUserCore(friendJpa.getUsuario2(), false, false),
                friendJpa.getStatus(),
                friendJpa.getCriadoEm(),
                friendJpa.getAtualizadoEm()
        );
    }

    /* ===================== MATCH ===================== */

    public MatchCore toPartidaCore(MatchCoreJpa match) {
        return match == null ? null : new MatchCore(
                match.getId(),
                match.getMap(),
                toUserCore(match.getWinner(), false, false),
                toUserCore(match.getLoser(), false, false),
                match.getWinnerScore(),
                match.getLoserScore(),
                match.getCriadoEm(),
                match.getAtualizadoEm()
        );
    }

    /* ===================== CHAT ===================== */

    public ChatCoreJpa toChatCoreJpa(ChatCore chat, UserCoreJpa owner) {
        logger.debug("MapperToJpaEntity::toChatCoreJpa");
        ChatCoreJpa chatJpa = new ChatCoreJpa();
        chatJpa.setId(chat.getId());
        chatJpa.setChatName(chat.getChatName());
        chatJpa.setOwner(owner);
        chatJpa.setDescricao(chat.getDescricao());
        chatJpa.setCriadoEm(chat.getCriadoEm());
        chatJpa.setAtualizadoEm(chat.getAtualizadoEm());
        return chatJpa;
    }

    public List<ChatUserCore> toChatUserCore(List<ChatUserCoreJpa> chatUserCoreJpa) {
        if (chatUserCoreJpa == null) return Collections.emptyList();
        return chatUserCoreJpa.stream()
                .map(userChat -> new ChatUserCore(
                        userChat.getChat().getId(),
                        userChat.getUsuario().getId(),
                        userChat.getStatusChat(),
                        userChat.getPermitionChat(),
                        userChat.getEntrouEm(),
                        userChat.getSaiuEm()
                )).toList();
    }

    private MembersChat getMembers(List<ChatUserCore> members) {
        MembersChat m = new MembersChat();
        if (members == null || members.isEmpty()) return m;

        for (ChatUserCore member : members) {
            if (member.permitionChat() == PermitionChat.ADM) m.adms.add(member);
            switch (member.statusChat()) {
                case ATIVE -> m.members.add(member);
                case BANED -> m.banned.add(member);
                case KICKET -> m.kicked.add(member);
                case MUTTED -> m.mutted.add(member);
            }
        }
        return m;
    }

    public ChatCore toChatCore(ChatCoreJpa chatJpa, boolean includeMessages) {
        if (chatJpa == null) return null;

        List<MessageCore> mensagens = includeMessages
                ? (chatJpa.getMensagens() == null ? Collections.emptyList() :
                chatJpa.getMensagens().stream().map(this::toMessageCore).toList())
                : null;

        MembersChat members = getMembers(toChatUserCore(chatJpa.getUsuarios()));

        return new ChatCore(
                chatJpa.getId(),
                chatJpa.getChatName(),
                toUserCore(chatJpa.getOwner(), false, false),
                chatJpa.getType(),
                chatJpa.getDescricao(),
                chatJpa.getPassword(),
                mensagens,
                members.adms,
                members.members,
                members.banned,
                members.kicked,
                members.mutted,
                chatJpa.getCriadoEm(),
                chatJpa.getAtualizadoEm()
        );
    }

    /* ===================== MESSAGE ===================== */

    public MessageCore toMessageCore(MessageCoreJpa messagesJpa) {
        return messagesJpa == null ? null : new MessageCore(
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
