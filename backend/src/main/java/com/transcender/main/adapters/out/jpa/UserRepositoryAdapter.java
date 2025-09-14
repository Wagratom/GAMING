package com.transcender.main.adapters.out.jpa;

import com.transcender.main.adapters.out.jpa.mapper.MapperToJpaEntity;
import com.transcender.main.adapters.out.jpa.repository.UserRepository;
import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.port.out.UserRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class UserRepositoryAdapter implements UserRepositoryPort {
    private final UserRepository userRepository;
    private final MapperToJpaEntity mapperToJpaEntity;
    private final Logger logger = LoggerFactory.getLogger(UserRepositoryAdapter.class);

    @Override
    public Optional<UserCore> getProfileById(Long userId) {
        logger.info("[INFO] consultando usuario {} em nossa base", userId);
        return userRepository.findById(userId)
                .map((user) -> (mapperToJpaEntity.toUserCore(user, false, true)));
    }

    @Override
    public Optional<UserCore> getUserById(Long userId) {
        logger.info("UserRepositoryAdapter > getUserById > exec");
        return userRepository.findById(userId)
                .map((user) -> (mapperToJpaEntity.toUserCore(user, false, false)));
    }

    @Override
    public Optional<UserCore> getUserByEmail(String email) {
        logger.info("UserRepositoryAdapter > getUserByEmail > exec");
        return userRepository.findByEmail(email)
                .map((user) -> mapperToJpaEntity.toUserCore(user, false, false));
    }

    @Override
    public Optional<UserCore> getUserByNickname(String nickname) {
        logger.info("UserRepositoryAdapter > getUserByNickname > exec");
        return userRepository.findByNickname(nickname)
                .map((user) -> mapperToJpaEntity.toUserCore(user, false, false));
    }

    @Override
    public List<UserCore> getUsers() {
        logger.info("UserRepositoryAdapter > getUsers > exec");
        return userRepository.findAll()
                .stream()
                .map((user) -> mapperToJpaEntity.toUserCore(user, false, false))
                .collect(Collectors.toList());
    }

    @Override
    public List<UserCore> getUsersOnline() {
        logger.info("UserRepositoryAdapter > getUsersOnline > exec");
        return userRepository.findByOnlineTrueAndAtiveTrue()
                .stream()
                .map((user) -> mapperToJpaEntity.toUserCore(user, false, false))
                .collect(Collectors.toList());
    }

    @Override
    public UserCore createUser(UserCore user) {
        logger.info("UserRepositoryAdapter > createUser > exec");
        logger.info("User: {}", user);
        return mapperToJpaEntity.toUserCore(userRepository.save(mapperToJpaEntity.toUserCoreJpa(user)), false, false);
    }

    @Override
    public boolean deleteUser(Long userId) {
        logger.info("UserRepositoryAdapter > deleteUser > exec");
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
        logger.info("UserRepositoryAdapter > updateUser > exec");
        return mapperToJpaEntity.toUserCore(userRepository.save(mapperToJpaEntity.toUserCoreJpa(user)), false, false);
    }

}