package com.transcender.main.domain.port.in;

import com.transcender.main.domain.entity.UserCore;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface UserPortIn {
    String login(Optional<String> nickname, Optional<String> email, String senha);
    UserCore getUserById(Long userId);
    List<Map<String, Object>> getUsersOnlines();
    Map<String, Object> getProfile(UserCore user);

    void deleteUser(Long userId);

    UserCore registerUser(UserCore user);
    UserCore updateUser(String newNickname, Long userId );
}
