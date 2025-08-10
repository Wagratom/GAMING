package com.transcender.main.domain.port.in;
import java.util.List;
import java.util.Map;

public interface FriendsPort {
    List<Map<String, Object>> getFriends(String jwt);
    boolean addFriend(String jwt, Long friendId);
    List<Map<String, Object>> removeFriend(String jwt, Long friendId);
    List<Map<String, Object>> blockFriend(String jwt, Long friendId);
}
