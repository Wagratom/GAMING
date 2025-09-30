package com.transcender.main.domain.port.out;

import com.transcender.main.domain.entity.FriendCore;
import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.enuns.FriendStatus;

import java.util.List;
import java.util.Optional;

public interface FriendsRepositoryPort {
    List<FriendCore> getFriendsCore(Long id, FriendStatus status);

    FriendCore addFriend(Long requester, Long friendId);
    FriendCore acceptFriend(Long requesterId, Long friendId);
    FriendCore declineFriend(Long requesterId, Long friendId);

    FriendCore removeFriend(Long requesterId, Long friendId);
    FriendCore blockFriend(Long requesterId, Long friendId);

    Optional<FriendCore> getFriendCore(Long userId1, Long userId2);
    boolean existsFriends(Long userId1, Long userId2);
    boolean existsBlock(Long userId1, Long userId2);
}
