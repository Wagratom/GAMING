package com.transcender.main.domain.port.in;

import com.transcender.main.domain.entity.UserCore;

import java.util.List;
import java.util.Optional;

public interface UserPortIn {

    String login(Optional<String> nickname, Optional<String> email, String senha);

    Long logout(String jwt);

    UserCore getUserByToken(String jwt);

    List<UserCore> getUsers(Boolean online, String jwt);

    UserCore getProfile(String jwt, Long userId);

    UserCore getUserById(Long userId);

    void deleteUser(Long userId);

    UserCore registerUser(UserCore user);

    UserCore updateUser(String newNickname, Long userId);
}
