package com.transcender.main.domain.port.out;

import com.transcender.main.domain.entity.UserCore;

import java.util.List;

public interface FriendsRepositoryPort {
    List<UserCore> getFriends(Long id);
    boolean addFriend(UserCore userID, UserCore friendId);
    boolean removeFriend(Long userID, Long friendId);
    boolean blockFriend(Long userID, Long friendId);


    boolean existsBlock(Long userId1, Long userId2);
}
