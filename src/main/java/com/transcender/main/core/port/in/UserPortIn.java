package com.transcender.main.core.port.in;

import com.transcender.main.core.Entity.UsuarioCore;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface UserPortIn {
    UsuarioCore getUserById(Long userId);
    List<Map<String, Object>> getUsersOnlines();
    Map<String, Object> getProfile(UsuarioCore user);

    void deleteUser(Long userId);

    UsuarioCore registerUser(UsuarioCore user);
    UsuarioCore updateUser(UsuarioCore user);
}
