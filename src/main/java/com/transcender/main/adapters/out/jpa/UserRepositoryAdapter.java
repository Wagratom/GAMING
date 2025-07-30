package com.transcender.main.adapters.out.jpa;

import com.transcender.main.adapters.out.jpa.entity.UsuarioCoreJpa;
import com.transcender.main.adapters.out.jpa.repository.UserRepository;
import com.transcender.main.domain.Entity.UsuarioCore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class UserRepositoryAdapter implements com.transcender.main.domain.port.out.UserRepository {
    private final UserRepository userRepository;

    @Autowired
    UserRepositoryAdapter(UserRepository usuarioRepository) {
        this.userRepository = usuarioRepository;
    }

    @Override
    public Optional<UsuarioCore> getUserById(Long userId) {
        return userRepository.findById(userId).map((this::toUsuarioCore));
    }

    @Override
    public Optional<UsuarioCore> getUserByEmail(String email) {
        return userRepository.findByEmail(email).map(this::toUsuarioCore);
    }

    @Override
    public Optional<UsuarioCore> getUserByNickname(String nickname) {
        return userRepository.findByNickname(nickname).map(this::toUsuarioCore);
    }

    @Override
    public List<UsuarioCore> getUsersOnlines() {
        return userRepository.findByOnlineTrueAndAtiveTrue()
                .stream()
                .map(this::toUsuarioCore)
                .collect(Collectors.toList());
    }

    @Override
    public UsuarioCore createUser(UsuarioCore user) {
        return toUsuarioCore(userRepository.save(toUsuarioCoreJpa(user)));
    }

    @Override
    public boolean deleteUser(Long userId) {
        try {
            return userRepository.findById(userId)
                    .map(user -> {
                        user.setAtive(false);
                        userRepository.save(user);
                        return true;
                    }).orElse(false);
        } catch (Exception err) {
            return false;
        }
    }

    @Override
    public UsuarioCore updateUser(UsuarioCore user) {
        return toUsuarioCore(userRepository.save(toUsuarioCoreJpa(user)));
    }

    public UsuarioCore toUsuarioCore(UsuarioCoreJpa user) {
        UsuarioCore userJpa = new UsuarioCore();
        userJpa.setId(user.getId());
        userJpa.setEmail(user.getEmail());
        userJpa.setSenha(user.getSenha());
        userJpa.setNickname(user.getNickname());
        userJpa.setTelefone(user.getTelefone());
        userJpa.setOnline(user.getOnline());
        userJpa.setAtualizadoEm(user.getAtualizadoEm());
        return userJpa;
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
