package com.transcender.main.domain.port.out;

import com.transcender.main.domain.entity.UserCore;

import java.util.List;
import java.util.Optional;

public interface UserRepositoryPort {
    Optional<UserCore> getUserById(Long userId);
    Optional<UserCore> getUserByEmail(String email);
    Optional<UserCore> getUserByNickname(String nickname);

    List<UserCore> getUsers();
    List<UserCore> getUsersOnline();

    UserCore createUser(UserCore user);
    boolean deleteUser(Long userId);
    UserCore updateUser(UserCore user);
}