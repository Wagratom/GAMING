package com.transcender.main.adapters.out.jpa;

import com.transcender.main.adapters.out.jpa.entity.FriendCoreJpa;
import com.transcender.main.adapters.out.jpa.entity.UserCoreJpa;
import com.transcender.main.adapters.out.jpa.repository.FriendRepository;
import com.transcender.main.adapters.out.jpa.mapper.MapperToJpaEntity;
import com.transcender.main.domain.entity.FriendCore;
import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.enuns.FriendStatus;
import com.transcender.main.domain.port.out.FriendsRepositoryPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class FriendRepositoryAdapter implements FriendsRepositoryPort {

    private final FriendRepository friendsRepository;
    private final MapperToJpaEntity mapperToJpaEntity;
    private final Logger logger = LoggerFactory.getLogger(FriendRepositoryAdapter.class);

    @Autowired
    public FriendRepositoryAdapter(FriendRepository friendsRepository, MapperToJpaEntity mapperToJpaEntity) {
        this.friendsRepository = friendsRepository;
        this.mapperToJpaEntity = mapperToJpaEntity;
    }

    @Override
    public List<FriendCore> getFriendsCore(Long userId, FriendStatus status) {
        logger.info("FriendRepositoryAdapter::getFriends::{}", status);

        return friendsRepository.findFriendsListByUserIdAndStatus(userId, status.name())
                .stream()
                .map(user -> mapperToJpaEntity.toAFriendCore(user))
                .collect(Collectors.toList());
    }

    @Override
    public boolean addFriend(UserCore solicitante, UserCore friend) {
        logger.info("FriendRepositoryAdapter::addFriend");
        updateFriendTable(solicitante, friend, FriendStatus.PENDING);
        return true;
    }

    @Override
    public boolean acceptFriend(UserCore solicitante, UserCore friend) {
        logger.info("FriendRepositoryAdapter::acceptFriend");
        updateFriendTable(solicitante, friend, FriendStatus.ACCEPTED);
        return true;
    }

    @Override
    public boolean recuseFriend(UserCore solicitante, UserCore friend) {
        logger.info("FriendRepositoryAdapter::recusetFriend");
        updateFriendTable(solicitante, friend, FriendStatus.DECLINED);
        return true;
    }

    @Override
    public boolean removeFriend(UserCore solicitante, UserCore friend) {
        logger.info("FriendRepositoryAdapter::removeFriend");
        updateFriendTable(solicitante, friend, FriendStatus.REMOVED);
        return true;
    }

    @Override
    public boolean blockFriend(UserCore solicitante, UserCore friend) {
        logger.info("FriendRepositoryAdapter::blockFriend");
        updateFriendTable(solicitante, friend, FriendStatus.BLOCKED);
        return true;
    }

    @Override
    public boolean existsFriends(Long userId1, Long userId2) {
        logger.info("FriendRepositoryAdapter::existsFriends");
        return friendsRepository.findFriendsByUsersIdAndStatus(userId1, userId2, FriendStatus.ACCEPTED.name()).isPresent();
    }

    @Override
    public boolean existsBlock(Long userId1, Long userId2) {
        logger.info("FriendRepositoryAdapter::existsBlock");
        return friendsRepository.findFriendsByUsersIdAndStatus(userId1, userId2, FriendStatus.BLOCKED.name()).isPresent();
    }

    private void updateFriendTable(UserCore solicitante, UserCore friend, FriendStatus status) {
        UserCoreJpa solicitanteJpa = mapperToJpaEntity.toUserCoreJpa(solicitante);
        UserCoreJpa friendJpa = mapperToJpaEntity.toUserCoreJpa(friend);

        Optional<FriendCoreJpa> amizadeExistente = friendsRepository.findFriendshipBetweenUsers(
                solicitanteJpa.getId(), friendJpa.getId()
        );

        friendsRepository.save(
                amizadeExistente
                        .map(amz -> {
                            amz.setStatus(status);
                            return amz;
                        })
                        .orElseGet(() -> new FriendCoreJpa(solicitanteJpa, friendJpa, status))
        );
    }
}