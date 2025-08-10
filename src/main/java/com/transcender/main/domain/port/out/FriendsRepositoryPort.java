package com.transcender.main.domain.port.out;

import com.transcender.main.domain.entity.UserCore;

import java.util.List;

public interface FriendsRepositoryPort {
    List<UserCore> getFriends(Long id);
    boolean addFriend(UserCore solicitante, UserCore friend);
    List<UserCore> removeFriend(Long userId, Long friendId);
    List<UserCore> blockFriend(Long userId, Long friendId);


    boolean existsBlock(Long userId1, Long userId2);
}
