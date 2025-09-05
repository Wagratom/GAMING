package com.transcender.main.domain.port.in;

import com.transcender.main.domain.entity.UserCore;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface UserPortIn {

    String login(Optional<String> nickname, Optional<String> email, String senha);

    Long logout(String jwt);

    Map<String, Object> getUserByToken(String jwt);

    List<Map<String, Object>> getUsers(Boolean online, String jwt);

    Map<String, Object> getProfile(String jwt);

    Map<String, Object> getUserById(Long userId);

    void deleteUser(Long userId);

    UserCore registerUser(UserCore user);

    UserCore updateUser(String newNickname, Long userId);
}
