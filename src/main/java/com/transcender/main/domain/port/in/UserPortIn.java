package com.transcender.main.domain.port.in;

import com.transcender.main.domain.entity.UserCore;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface UserPortIn {
    String login(Optional<String> nickname, Optional<String> email, String senha);
    void logout(String jwt);
    UserCore getUserById(Long userId);
    List<Map<String, Object>> getUsers(Boolean online, String jwt);
    Map<String, Object> getProfile(String jwt);

    void deleteUser(Long userId);

    UserCore registerUser(UserCore user);
    UserCore updateUser(String newNickname, Long userId );
}
