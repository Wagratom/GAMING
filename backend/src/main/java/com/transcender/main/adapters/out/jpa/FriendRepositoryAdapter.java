package com.transcender.main.adapters.out.jpa;

import com.transcender.main.adapters.out.jpa.entity.FriendCoreJpa;
import com.transcender.main.adapters.out.jpa.entity.UserCoreJpa;
import com.transcender.main.adapters.out.jpa.mapper.MapperToJpaEntity;
import com.transcender.main.adapters.out.jpa.repository.FriendRepository;
import com.transcender.main.domain.entity.FriendCore;
import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.enuns.FriendStatus;
import com.transcender.main.domain.port.out.FriendsRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class FriendRepositoryAdapter implements FriendsRepositoryPort {

    private final FriendRepository friendsRepository;
    private final MapperToJpaEntity mapperToJpaEntity;
    private final Logger logger = LoggerFactory.getLogger(FriendRepositoryAdapter.class);

    @Override
    public List<FriendCore> getFriendsCore(Long userId, FriendStatus status) {
        logger.info("FriendRepositoryAdapter::getFriends::{}", status);

        return friendsRepository.findFriendsListByUserIdAndStatus(userId, status.name())
                .stream()
                .map(user -> mapperToJpaEntity.toFriendCore(user))
                .collect(Collectors.toList());
    }

    @Override
    public FriendCore addFriend(UserCore solicitante, UserCore friend) {
        logger.info("FriendRepositoryAdapter::addFriend");
        return updateFriendTable(solicitante, friend, FriendStatus.PENDING);
    }

    @Override
    public FriendCore acceptFriend(UserCore solicitante, UserCore friend) {
        logger.info("FriendRepositoryAdapter::acceptFriend");
        return updateFriendTable(solicitante, friend, FriendStatus.ACCEPTED);
    }

    public FriendCore declineFriend(UserCore solicitante, UserCore friend) {
        logger.info("FriendRepositoryAdapter::acceptFriend");
        return updateFriendTable(solicitante, friend, FriendStatus.DECLINED);
    }

    @Override
    public FriendCore removeFriend(UserCore solicitante, UserCore friend) {
        logger.info("FriendRepositoryAdapter::removeFriend");
        return updateFriendTable(solicitante, friend, FriendStatus.REMOVED);
    }

    @Override
    public FriendCore blockFriend(UserCore solicitante, UserCore friend) {
        logger.info("FriendRepositoryAdapter::blockFriend");
        return updateFriendTable(solicitante, friend, FriendStatus.BLOCKED);
    }

    @Override
    public Optional<FriendCore> getFriendCore(Long userId1, Long userId2) {
        return friendsRepository.findFriendsByUsersId(userId1, userId2)
                .map((FriendShip) -> mapperToJpaEntity.toFriendCore(FriendShip));
    }

    @Override
    public boolean existsFriends(Long userId1, Long userId2) {
        boolean exist = friendsRepository.findFriendsByUsersIdAndStatus(userId1, userId2, FriendStatus.ACCEPTED.name()).isPresent();
        logger.info("FriendRepositoryAdapter::existsFriends::exist={}", exist);
        return exist;
    }

    @Override
    public boolean existsBlock(Long userId1, Long userId2) {
        boolean exist = friendsRepository.findFriendsByUsersIdAndStatus(userId1, userId2, FriendStatus.BLOCKED.name()).isPresent();
        logger.info("FriendRepositoryAdapter::existsBlock::exist={}", exist);
        return exist;
    }

    private FriendCore updateFriendTable(UserCore solicitante, UserCore friend, FriendStatus status) {
        UserCoreJpa solicitanteJpa = mapperToJpaEntity.toUserCoreJpa(solicitante);
        UserCoreJpa friendJpa = mapperToJpaEntity.toUserCoreJpa(friend);

        Optional<FriendCoreJpa> amizadeExistente = friendsRepository.findFriendshipBetweenUsers(
                solicitanteJpa.getId(), friendJpa.getId()
        );

        FriendCoreJpa newFriend = friendsRepository.save(
                amizadeExistente.map(amz -> {
                    amz.setStatus(status);
                    return amz;
                }).orElseGet(() -> new FriendCoreJpa(solicitanteJpa, friendJpa, status))
        );
        return mapperToJpaEntity.toFriendCore(newFriend);
    }

}