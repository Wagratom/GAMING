package com.transcender.main.domain.port.out;

import com.transcender.main.domain.entity.FriendCore;
import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.enuns.FriendStatus;

import java.util.List;

public interface FriendsRepositoryPort {
    List<FriendCore> getFriendsCore(Long id, FriendStatus status);

    FriendCore addFriend(UserCore solicitante, UserCore friend);
    FriendCore acceptFriend(UserCore solicitante, UserCore friend);
    FriendCore declineFriend(UserCore solicitante, UserCore friend);

    FriendCore removeFriend(UserCore solicitante, UserCore friend);
    FriendCore blockFriend(UserCore solicitante, UserCore friend);

    boolean existsFriends(Long userId1, Long userId2);
    boolean existsBlock(Long userId1, Long userId2);
}
