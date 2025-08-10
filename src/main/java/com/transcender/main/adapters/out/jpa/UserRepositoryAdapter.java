package com.transcender.main.adapters.out.jpa;

import com.transcender.main.adapters.out.jpa.repository.FriendRepository;
import com.transcender.main.adapters.out.jpa.repository.UserRepository;
import com.transcender.main.adapters.out.jpa.mapper.MapperToJpaEntity;
import com.transcender.main.domain.entity.UserCore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.transcender.main.domain.port.out.UserRepositoryPort;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class UserRepositoryAdapter implements UserRepositoryPort {
    private final UserRepository userRepository;
    private final FriendRepository amizadeRepository;
    private final MapperToJpaEntity mapperToJpaEntity;

    @Autowired
    UserRepositoryAdapter(UserRepository usuarioRepository, FriendRepository amizadeRepository, MapperToJpaEntity mapperToJpaEntity) {
        this.userRepository = usuarioRepository;
        this.amizadeRepository = amizadeRepository;
        this.mapperToJpaEntity = mapperToJpaEntity;
    }

    @Override
    public Optional<UserCore> getUserById(Long userId) {
        return userRepository.findById(userId)
                .map((user) -> (mapperToJpaEntity.toUserCore(user, false)));
    }

    @Override
    public Optional<UserCore> getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map((user) -> mapperToJpaEntity.toUserCore(user, false));
    }

    @Override
    public Optional<UserCore> getUserByNickname(String nickname) {
        return userRepository.findByNickname(nickname)
                .map((user) -> mapperToJpaEntity.toUserCore(user, false));
    }

    @Override
    public List<UserCore> getUsers() {
        return userRepository.findAll()
                .stream()
                .map((user) -> mapperToJpaEntity.toUserCore(user, false))
                .collect(Collectors.toList());
    }

    @Override
    public List<UserCore> getUsersOnline() {
        return userRepository.findByOnlineTrueAndAtiveTrue()
                .stream()
                .map((user) -> mapperToJpaEntity.toUserCore(user, false))
                .collect(Collectors.toList());
    }

    @Override
    public UserCore createUser(UserCore user) {
        return mapperToJpaEntity.toUserCore(userRepository.save(mapperToJpaEntity.toUserCoreJpa(user)), false);
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
        return mapperToJpaEntity.toUserCore(userRepository.save(mapperToJpaEntity.toUserCoreJpa(user)), false);
    }

}
