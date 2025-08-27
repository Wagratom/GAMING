package com.transcender.main.adapters.out.jpa.mapper;

import com.transcender.main.adapters.out.jpa.entity.FriendCoreJpa;
import com.transcender.main.adapters.out.jpa.entity.UserCoreJpa;
import com.transcender.main.domain.entity.FriendCore;
import com.transcender.main.domain.entity.UserCore;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class MapperToJpaEntity {
    public UserCore toUserCore(UserCoreJpa user, boolean includeFriends) {
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
}
