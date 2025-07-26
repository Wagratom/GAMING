package com.transcender.main.core.port.in;

import com.transcender.main.core.Entity.UsuarioCore;

import java.util.Optional;

public interface UserPortIn {
    UsuarioCore getUser(Long userId);
    UsuarioCore getProfile(UsuarioCore user);

    void deleteUser(Long userId);

    UsuarioCore registerUser(UsuarioCore user);
    UsuarioCore updateUser(UsuarioCore user);
}
