package com.transcender.main.adapters.out.jpa;

import com.transcender.main.adapters.out.jpa.entity.UsuarioCoreJpa;
import com.transcender.main.core.Entity.UsuarioCore;
import com.transcender.main.core.port.out.UserRepository;

import java.util.List;
import java.util.Optional;

public class UserRepositoryImpl implements UserRepository {
    @Override
    public Optional<UsuarioCore> getUserById(Long userId) {
        return Optional.empty();
    }

    @Override
    public Optional<UsuarioCore> getUserByEmail(String email) {
        return Optional.empty();
    }

    @Override
    public Optional<UsuarioCore> getUserByNickname(String nickname) {
        return Optional.empty();
    }

    @Override
    public Optional<List<UsuarioCore>> getUsersOnlines() {
        return Optional.empty();
    }

    @Override
    public UsuarioCore createUser(UsuarioCore user) {
        return null;
    }

    @Override
    public boolean deleteUser(Long userId) {
        return false;
    }

    @Override
    public UsuarioCore updateUser(UsuarioCore user) {
        return null;
    }

    public UsuarioCoreJpa toUsuarioCoreJpa(UsuarioCore user) {
        UsuarioCoreJpa userJpa = new UsuarioCoreJpa();
        userJpa.setId(user.getId());
        userJpa.setEmail(user.getEmail());
        userJpa.setSenha(user.getSenha());
        userJpa.setNickname(user.getNickname());
        userJpa.setTelefone(user.getTelefone());
        userJpa.setOnline(user.getOnline());
        userJpa.setAtualizadoEm(user.getAtualizadoEm());
        return userJpa;
    }
}
