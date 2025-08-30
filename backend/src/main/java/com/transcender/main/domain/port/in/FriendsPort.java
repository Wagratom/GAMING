package com.transcender.main.domain.port.in;
import com.transcender.main.domain.enuns.FriendStatus;

import java.util.List;
import java.util.Map;

public interface FriendsPort {
    List<Map<String, Object>> getFriendsNotication(String jwt, FriendStatus status);
    List<Map<String, Object>> getFriends(String jwt, FriendStatus status);

    Map<String, Object> addFriend(String jwt, Long friendId);
    Map<String, Object> acceptFriend(String jwt, Long friendId);
    Map<String, Object> declineFriend(String jwt, Long friendId);

    Map<String, Object> removeFriend(String jwt, Long friendId);
    Map<String, Object> blockFriend(String jwt, Long friendId);
}
