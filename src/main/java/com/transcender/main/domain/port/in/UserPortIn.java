package com.transcender.main.domain.port.in;

import com.transcender.main.domain.Entity.UsuarioCore;

import java.util.List;
import java.util.Map;

public interface UserPortIn {
    UsuarioCore getUserById(Long userId);
    List<Map<String, Object>> getUsersOnlines();
    Map<String, Object> getProfile(UsuarioCore user);

    void deleteUser(Long userId);

    UsuarioCore registerUser(UsuarioCore user);
    UsuarioCore updateUser(UsuarioCore user);
}
