package com.transcender.main.domain.port.out;

import com.transcender.main.domain.Entity.UsuarioCore;

import java.util.List;
import java.util.Optional;

public interface UserRepository {
    Optional<UsuarioCore> getUserById(Long userId);
    Optional<UsuarioCore> getUserByEmail(String email);
    Optional<UsuarioCore> getUserByNickname(String nickname);
    List<UsuarioCore> getUsersOnlines();

    UsuarioCore createUser(UsuarioCore user);
    boolean deleteUser(Long userId);
    UsuarioCore updateUser(UsuarioCore user);
}