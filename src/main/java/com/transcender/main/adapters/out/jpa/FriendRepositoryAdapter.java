package com.transcender.main.adapters.out.jpa;

import com.transcender.main.adapters.out.jpa.entity.FriendCoreJpa;
import com.transcender.main.adapters.out.jpa.entity.UserCoreJpa;
import com.transcender.main.adapters.out.jpa.repository.FriendRepository;
import com.transcender.main.adapters.out.jpa.repository.UserRepository;
import com.transcender.main.adapters.out.jpa.mapper.MapperToJpaEntity;
import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.enuns.FriendStatus;
import com.transcender.main.domain.port.out.FriendsRepositoryPort;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class FriendRepositoryAdapter implements FriendsRepositoryPort {
    private final FriendRepository amizadeRepository;
    private final UserRepository userRepository;
    private final MapperToJpaEntity mapperToJpaEntity;

    @Autowired
    public FriendRepositoryAdapter(FriendRepository amizadeRepository,
                                   UserRepository userRepository,
                                   MapperToJpaEntity mapperToJpaEntity) {
        this.amizadeRepository = amizadeRepository;
        this.userRepository = userRepository;
        this.mapperToJpaEntity = mapperToJpaEntity;
    }


    @Override
    public List<UserCore> getFriends(Long userId) {
        return amizadeRepository.findAcceptedFriendsByUserId(userId)
                .stream()
                .map((user) -> mapperToJpaEntity.toUserCore(user, false))
                .collect(Collectors.toList());
    }

    @Override
    public boolean addFriend(UserCore user1, UserCore user2) {
        UserCoreJpa user1Jpa = mapperToJpaEntity.toUserCoreJpa(user1);
        UserCoreJpa user2Jpa = mapperToJpaEntity.toUserCoreJpa(user2);

        Optional<FriendCoreJpa> amizadeExistente = amizadeRepository
                .findFriendshipBetweenUsers(user1Jpa.getId(), user2Jpa.getId());

        if (amizadeExistente.isPresent()) {
            // UPDATE — altera status da amizade existente
            FriendCoreJpa amizade = amizadeExistente.get();
            amizade.setStatus(FriendStatus.PENDING); // ou ACCEPTED, dependendo do caso
            amizadeRepository.save(amizade);
        } else {
            // CREATE — cria nova amizade
            amizadeRepository.save(new FriendCoreJpa(
                    user1Jpa,
                    user2Jpa,
                    FriendStatus.PENDING
            ));
        }

        return true;
    }

    @Override
    public boolean removeFriend(Long userId, Long friendId) {
        FriendCoreJpa coluna = amizadeRepository.findFriendshipBetweenUsers(userId, friendId)
                .orElseThrow(() -> new NoSuchElementException(
                        String.format("Amizade entre usuário %d e %d não encontrada", userId, friendId)
                ));
        coluna.setStatus(FriendStatus.REMOVED);
        amizadeRepository.save(coluna);
        return true;
    }

    @Override
    public boolean blockFriend(Long userId, Long friendId) {
        FriendCoreJpa coluna = amizadeRepository.findFriendshipBetweenUsers(userId, friendId)
                .orElseThrow(() -> new NoSuchElementException(
                        String.format("Amizade entre usuário %d e %d não encontrada", userId, friendId)
                ));
        coluna.setStatus(FriendStatus.BLOCKED);
        amizadeRepository.save(coluna);
        return true;
    }

    @Override
    public boolean existsBlock(Long userId1, Long userId2) {
        return amizadeRepository.existsBlockedFriendshipByUserId(userId1, userId2);
    }
}
