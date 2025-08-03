package com.transcender.main.domain.port.in;

import com.transcender.main.domain.Entity.UserCore;

import java.util.List;
import java.util.Map;

public interface UserPortIn {
    UserCore getUserById(Long userId);
    List<Map<String, Object>> getUsersOnlines();
    Map<String, Object> getProfile(UserCore user);

    void deleteUser(Long userId);

    UserCore registerUser(UserCore user);
    UserCore updateUser(String newNickname, Long userId );
}
