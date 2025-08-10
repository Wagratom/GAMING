package com.transcender.main.domain.port.in;
import java.util.List;
import java.util.Map;

public interface FriendsPort {
    List<Map<String, Object>> getFriends(String jwt);
    boolean addFriend(Long userId, String jwt);
    boolean removeFriend(Long userId, String jwt);
    boolean blockFriend(Long userId, String jwt);
}
