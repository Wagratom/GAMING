package com.transcender.main.adapters.out.jpa;

import com.transcender.main.adapters.out.jpa.entity.UserCoreJpa;
import com.transcender.main.adapters.out.jpa.repository.UserRepository;
import com.transcender.main.domain.entity.UserCore;
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
    public Optional<UserCore> getUserById(Long userId) {
        return userRepository.findById(userId).map((this::toUserCore));
    }

    @Override
    public Optional<UserCore> getUserByEmail(String email) {
        return userRepository.findByEmail(email).map(this::toUserCore);
    }

    @Override
    public Optional<UserCore> getUserByNickname(String nickname) {
        return userRepository.findByNickname(nickname).map(this::toUserCore);
    }

    @Override
    public List<UserCore> getUsersOnline() {
        return userRepository.findByOnlineTrueAndAtiveTrue()
                .stream()
                .map(this::toUserCore)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserCore> getFriendsOnline(Long userId) {
        return userRepository.findByOnlineTrueAndAtiveTrue()
                .stream()
                .map(this::toUserCore)
                .collect(Collectors.toList());
    }

    @Override
    public UserCore createUser(UserCore user) {
        return toUserCore(userRepository.save(toUserCoreJpa(user)));
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
    public UserCore updateUser(UserCore user) {
        return toUserCore(userRepository.save(toUserCoreJpa(user)));
    }

    public UserCore toUserCore(UserCoreJpa user) {
        return new UserCore(
                user.getId(),
                user.getEmail(),
                user.getSenhaHash(),
                user.getNickname(),
                user.getTelefone(),
                user.getOnline(),
                user.getCriadoEm(),
                user.getAtualizadoEm()
        );
    }

    public UserCoreJpa toUserCoreJpa(UserCore user) {
        UserCoreJpa userJpa = new UserCoreJpa();
        userJpa.setId(user.getId());
        userJpa.setEmail(user.getEmail());
        userJpa.setSenhaHash(user.getSenha());
        userJpa.setNickname(user.getNickname());
        userJpa.setTelefone(user.getTelefone());
        userJpa.setOnline(user.getOnline());
        userJpa.setAtualizadoEm(user.getAtualizadoEm());
        return userJpa;
    }
}
