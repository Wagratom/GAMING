package com.transcender.main.domain.port.out;

import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.enuns.FriendStatus;

import java.util.List;

public interface FriendsRepositoryPort {
    List<UserCore> getFriends(Long id, FriendStatus status);

    boolean addFriend(UserCore solicitante, UserCore friend);
    boolean acceptFriend(UserCore solicitante, UserCore friend);
    boolean recuseFriend(UserCore solicitante, UserCore friend);

    List<UserCore> removeFriend(UserCore solicitante, UserCore friend);
    List<UserCore> blockFriend(UserCore solicitante, UserCore friend);


    boolean existsBlock(Long userId1, Long userId2);
}
