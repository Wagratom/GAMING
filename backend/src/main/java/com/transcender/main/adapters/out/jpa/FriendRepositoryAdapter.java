package com.transcender.main.adapters.out.jpa;

import com.transcender.main.adapters.out.jpa.entity.FriendCoreJpa;
import com.transcender.main.adapters.out.jpa.entity.UserCoreJpa;
import com.transcender.main.adapters.out.jpa.mapper.MapperToJpaEntity;
import com.transcender.main.adapters.out.jpa.repository.FriendRepository;
import com.transcender.main.adapters.out.jpa.repository.UserRepository;
import com.transcender.main.domain.entity.FriendCore;
import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.enuns.FriendStatus;
import com.transcender.main.domain.exceptions.ResourceNotFound;
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
    private final UserRepository userRepository;
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
    public FriendCore addFriend(Long requesterId, Long friendId) {
        logger.info("FriendRepositoryAdapter::addFriend");
        UserCoreJpa requester = userRepository.findById(requesterId).orElseThrow(() -> new ResourceNotFound("User", requesterId));
        UserCoreJpa friend = userRepository.findById(friendId).orElseThrow(() -> new ResourceNotFound("User", friendId));

        return updateFriendTable(requester, friend, FriendStatus.PENDING);
    }

    @Override
    public FriendCore acceptFriend(Long requesterId, Long friendId) {
        logger.info("FriendRepositoryAdapter::acceptFriend");

        UserCoreJpa requester = userRepository.findById(requesterId).orElseThrow(() -> new ResourceNotFound("User", requesterId));
        UserCoreJpa friend = userRepository.findById(friendId).orElseThrow(() -> new ResourceNotFound("User", friendId));

        return updateFriendTable(requester, friend, FriendStatus.ACCEPTED);
    }

    @Override
    public FriendCore declineFriend(Long requesterId, Long friendId) {
        logger.info("FriendRepositoryAdapter::declineFriend");

        UserCoreJpa requester = userRepository.findById(requesterId).orElseThrow(() -> new ResourceNotFound("User", requesterId));
        UserCoreJpa friend = userRepository.findById(friendId).orElseThrow(() -> new ResourceNotFound("User", friendId));

        return updateFriendTable(requester, friend, FriendStatus.DECLINED);
    }

    @Override
    public FriendCore removeFriend(Long requesterId, Long friendId) {
        logger.info("FriendRepositoryAdapter::removeFriend");

        UserCoreJpa requester = userRepository.findById(requesterId).orElseThrow(() -> new ResourceNotFound("User", requesterId));
        UserCoreJpa friend = userRepository.findById(friendId).orElseThrow(() -> new ResourceNotFound("User", friendId));

        return updateFriendTable(requester, friend, FriendStatus.REMOVED);
    }

    @Override
    public FriendCore blockFriend(Long requesterId, Long friendId) {
        logger.info("FriendRepositoryAdapter::blockFriend");

        UserCoreJpa requester = userRepository.findById(requesterId).orElseThrow(() -> new ResourceNotFound("User", requesterId));
        UserCoreJpa friend = userRepository.findById(friendId).orElseThrow(() -> new ResourceNotFound("User", friendId));

        return updateFriendTable(requester, friend, FriendStatus.BLOCKED);
    }

    @Override
    public Optional<FriendCore> getFriendCore(Long userId1, Long userId2) {
        return friendsRepository.findFriendsByUsersId(userId1, userId2)
                .map((FriendShip) -> mapperToJpaEntity.toFriendCore(FriendShip));
    }

    @Override
    public boolean existsFriends(Long userId1, Long userId2) {
        try {
        return friendsRepository.findFriendsByUsersIdAndStatus(userId1, userId2, FriendStatus.ACCEPTED.name()).isPresent();
        } catch (Exception exception) {
            return false;
        }
    }

    @Override
    public boolean existsBlock(Long userId1, Long userId2) {
        boolean exist = friendsRepository.findFriendsByUsersIdAndStatus(userId1, userId2, FriendStatus.BLOCKED.name()).isPresent();
        logger.info("FriendRepositoryAdapter::existsBlock::exist={}", exist);
        return exist;
    }

    private FriendCore updateFriendTable(UserCoreJpa solicitante, UserCoreJpa friend, FriendStatus status) {

        Optional<FriendCoreJpa> amizadeExistente = friendsRepository.findFriendshipBetweenUsers(
                solicitante.getId(), friend.getId()
        );

        FriendCoreJpa newFriend = friendsRepository.save(
                amizadeExistente.map(amz -> {
                    amz.setStatus(status);
                    return amz;
                }).orElseGet(() -> new FriendCoreJpa(solicitante, friend, status))
        );
        return mapperToJpaEntity.toFriendCore(newFriend);
    }

}