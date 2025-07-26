package com.transcender.main.core.port.out;

import com.transcender.main.core.Entity.UsuarioCore;

import java.util.Optional;

public interface UserRepository {
    Optional<UsuarioCore> getUserById(Long userId);
    Optional<UsuarioCore> getUserByEmail(String email);
    Optional<UsuarioCore> getUserByNickname(String nickname);

    UsuarioCore createUser(UsuarioCore user);
    boolean deleteUser(Long userId);
    UsuarioCore updateUser(UsuarioCore user);
}