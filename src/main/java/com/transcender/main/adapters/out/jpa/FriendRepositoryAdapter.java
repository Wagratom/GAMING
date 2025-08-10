package com.transcender.main.adapters.out.jpa;

import com.transcender.main.adapters.out.jpa.entity.FriendCoreJpa;
import com.transcender.main.adapters.out.jpa.entity.UserCoreJpa;
import com.transcender.main.adapters.out.jpa.repository.FriendRepository;
import com.transcender.main.adapters.out.jpa.mapper.MapperToJpaEntity;
import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.enuns.FriendStatus;
import com.transcender.main.domain.port.out.FriendsRepositoryPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class FriendRepositoryAdapter implements FriendsRepositoryPort {
    private final FriendRepository amizadeRepository;
    private final MapperToJpaEntity mapperToJpaEntity;
    private final Logger logger = LoggerFactory.getLogger(UserRepositoryAdapter.class);

    @Autowired
    public FriendRepositoryAdapter(FriendRepository amizadeRepository, MapperToJpaEntity mapperToJpaEntity) {
        this.amizadeRepository = amizadeRepository;
        this.mapperToJpaEntity = mapperToJpaEntity;
    }


    @Override
    public List<UserCore> getFriends(Long userId, FriendStatus status) {
        logger.info("FriendRepositoryAdapter > getFriends > exec");
        return amizadeRepository.findAcceptedFriendsByUserId(userId, status)
                .stream()
                .map((user) -> mapperToJpaEntity.toUserCore(user, false))
                .collect(Collectors.toList());
    }

    @Override
    public boolean addFriend(UserCore solicitante, UserCore friend) {
        logger.info("FriendRepositoryAdapter > addFriend > exec");
        UserCoreJpa solicitanteJpa = mapperToJpaEntity.toUserCoreJpa(solicitante);
        UserCoreJpa friendJpa = mapperToJpaEntity.toUserCoreJpa(friend);

        Optional<FriendCoreJpa> amizadeExistente = amizadeRepository
                .findFriendshipBetweenUsers(solicitanteJpa.getId(), friendJpa.getId());

        if (amizadeExistente.isPresent()) {
            // UPDATE — altera status da amizade existente
            FriendCoreJpa amizade = amizadeExistente.get();
            amizade.setStatus(FriendStatus.PENDING); // ou ACCEPTED, dependendo do caso
            amizadeRepository.save(amizade);
        } else {
            // CREATE — cria nova amizade
            amizadeRepository.save(new FriendCoreJpa(
                    solicitanteJpa,
                    friendJpa,
                    FriendStatus.PENDING
            ));
        }
        return true;
    }

    @Override
    public  List<UserCore> removeFriend(Long userId, Long friendId) {
        logger.info("FriendRepositoryAdapter > removeFriend > exec");
        FriendCoreJpa coluna = amizadeRepository.findFriendshipBetweenUsers(userId, friendId)
                .orElseThrow(() -> new NoSuchElementException(
                        String.format("Amizade entre usuário %d e %d não encontrada", userId, friendId)
                ));
        coluna.setStatus(FriendStatus.REMOVED);
        amizadeRepository.save(coluna);
        return getFriends(userId, FriendStatus.ACCEPTED);
    }

    @Override
    public  List<UserCore> blockFriend(Long userId, Long friendId) {
        logger.info("FriendRepositoryAdapter > blockFriend > exec");
        FriendCoreJpa coluna = amizadeRepository.findFriendshipBetweenUsers(userId, friendId)
                .orElseThrow(() -> new NoSuchElementException(
                        String.format("Amizade entre usuário %d e %d não encontrada", userId, friendId)
                ));
        coluna.setStatus(FriendStatus.BLOCKED);
        amizadeRepository.save(coluna);
        return getFriends(userId, FriendStatus.ACCEPTED);
    }

    @Override
    public boolean existsBlock(Long userId1, Long userId2) {
        logger.info("FriendRepositoryAdapter > existsBlock > exec");
        return amizadeRepository.existsBlockedFriendshipByUserId(userId1, userId2);
    }
}
