package com.transcender.main.domain.port.in;
import com.transcender.main.domain.enuns.FriendStatus;

import java.util.List;
import java.util.Map;

public interface FriendsPort {
    List<Map<String, Object>> getFriends(String jwt, FriendStatus status);

    boolean addFriend(String jwt, Long friendId);
    boolean acceptFriend(String jwt, Long friendId);
    boolean recusetFriend(String jwt, Long friendId);

    boolean removeFriend(String jwt, Long friendId);
    boolean blockFriend(String jwt, Long friendId);
}
