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
                ? user.getSolicitadas().stream().map(this::toAFriendCore).collect(Collectors.toSet())
                : Set.of();

        Set<FriendCore> receives = includeFriends
                ? user.getRecebidas().stream().map(this::toAFriendCore).collect(Collectors.toSet())
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
        UserCoreJpa userJpa = new UserCoreJpa();
        userJpa.setId(user.getId());
        userJpa.setEmail(user.getEmail());
        userJpa.setSenhaHash(user.getGetSenhaHash());
        userJpa.setNickname(user.getNickname());
        userJpa.setTelefone(user.getTelefone());
        userJpa.setOnline(user.getOnline());
        userJpa.setAtualizadoEm(user.getAtualizadoEm());
        return userJpa;
    }

    public FriendCore toAFriendCore(FriendCoreJpa friendjpa) {
        return new FriendCore(
                friendjpa.getId(),
                friendjpa.getUsuario1().getId(),
                friendjpa.getUsuario2().getId(),
                friendjpa.getStatus(),
                friendjpa.getCriadoEm(),
                friendjpa.getAtualizadoEm()
        );
    }
}
