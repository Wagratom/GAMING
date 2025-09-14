package com.transcender.main.domain.port.in;
import com.transcender.main.domain.enuns.FriendStatus;

import java.util.List;
import java.util.Map;

public interface FriendsPort {
    List<Map<String, Object>> getFriendsNotication(String jwt, FriendStatus status);
    List<Map<String, Object>> getFriends(String jwt, FriendStatus status);

    void addFriend(String jwt, Long friendId);
    void acceptFriend(String jwt, Long friendId);
    void declineFriend(String jwt, Long friendId);

    void removeFriend(String jwt, Long friendId);
    void blockFriend(String jwt, Long friendId);
}
