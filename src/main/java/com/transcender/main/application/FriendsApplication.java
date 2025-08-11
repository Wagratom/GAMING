package com.transcender.main.application;

import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.enuns.FriendStatus;
import com.transcender.main.domain.exceptions.BadRequest;
import com.transcender.main.domain.exceptions.ResourceNotFound;
import com.transcender.main.domain.exceptions.Unauthorized;
import com.transcender.main.domain.port.in.FriendsPort;
import com.transcender.main.domain.port.out.FriendsRepositoryPort;
import com.transcender.main.domain.port.out.JwtService;
import com.transcender.main.domain.port.out.UserRepositoryPort;
import io.jsonwebtoken.JwtException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FriendsApplication implements FriendsPort {

    private static final Logger logger = LoggerFactory.getLogger(FriendsApplication.class);

    private final UserRepositoryPort userRepository;
    private final FriendsRepositoryPort friendsRepository;
    private final JwtService jwtService;

    public FriendsApplication(UserRepositoryPort userRepository,
                              JwtService jwtService,
                              FriendsRepositoryPort friendsRepository) {
        this.userRepository = userRepository;
        this.friendsRepository = friendsRepository;
        this.jwtService = jwtService;
    }

    private record UsersPair(UserCore user1, UserCore user2) {}

    private Long extractUserIdFromJwt(String jwt) {
        if (jwt == null || jwt.length() < 7) {
            throw new Unauthorized("Token inválido");
        }
        try {
            // Remove prefix "Bearer "
            String token = jwt.substring(7);
            Map<String, Object> claims = jwtService.validateTokenAndGetClaims(token);
            return ((Number) claims.get("id")).longValue();
        } catch (JwtException ex) {
            logger.error("Falha ao decodificar token JWT", ex);
            throw new Unauthorized("Token inválido");
        }
    }

    private UsersPair validateAndGetUsers(Long requesterId, Long friendId) {
        UserCore requester = userRepository.getUserById(requesterId)
                .orElseThrow(() -> new ResourceNotFound("UsuarioSolicitante", requesterId));

        UserCore friend = userRepository.getUserById(friendId)
                .orElseThrow(() -> new ResourceNotFound("Usuario", friendId));

        if (requester.getId().equals(friend.getId())) {
            throw new BadRequest("O usuário não pode adicionar ele mesmo");
        }

        logger.info("Verificando se o usuário está bloqueado");
        if (friendsRepository.existsBlock(requester.getId(), friend.getId())) {
            throw new BadRequest("Não é permitido adicionar um usuário bloqueado.");
        }

        return new UsersPair(requester, friend);
    }

    private List<Map<String, Object>> convertUsersToJson(List<UserCore> users) {
        return users.stream()
                .map(user -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", user.getId());
                    map.put("nickname", user.getNickname());
                    map.put("online", user.getOnline());
                    map.put("criando_em", user.getCriadoEm());
                    return map;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getFriends(String jwt, FriendStatus status) {
        Long userId = extractUserIdFromJwt(jwt);
        FriendStatus effectiveStatus = status != null ? status : FriendStatus.ACCEPTED;
        logger.info("Obtendo amigos do usuário {} com status {}", userId, effectiveStatus);
        List<UserCore> friends = friendsRepository.getFriends(userId, effectiveStatus);
        return convertUsersToJson(friends);
    }

    @Override
    public boolean addFriend(String jwt, Long friendId) {
        Long requesterId = extractUserIdFromJwt(jwt);
        logger.info("Solicitação de amizade: solicitante={} | amigo={}", requesterId, friendId);
        UsersPair users = validateAndGetUsers(requesterId, friendId);
        return friendsRepository.addFriend(users.user1(), users.user2());
    }

    @Override
    public boolean acceptFriend(String jwt, Long friendId) {
        Long requesterId = extractUserIdFromJwt(jwt);
        logger.info("Aceitar amizade: solicitante={} | amigo={}", requesterId, friendId);
        UsersPair users = validateAndGetUsers(requesterId, friendId);
        return friendsRepository.acceptFriend(users.user1(), users.user2());
    }

    @Override
    public boolean recusetFriend(String jwt, Long friendId) {
        Long requesterId = extractUserIdFromJwt(jwt);
        logger.info("Recusar amizade: solicitante={} | amigo={}", requesterId, friendId);
        UsersPair users = validateAndGetUsers(requesterId, friendId);
        return friendsRepository.recuseFriend(users.user1(), users.user2());
    }

    @Override
    public List<Map<String, Object>> removeFriend(String jwt, Long friendId) {
        Long requesterId = extractUserIdFromJwt(jwt);
        logger.info("Remover amizade: solicitante={} | amigo={}", requesterId, friendId);
        UsersPair users = validateAndGetUsers(requesterId, friendId);
        List<UserCore> result = friendsRepository.removeFriend(users.user1(), users.user2());
        return convertUsersToJson(result);
    }

    @Override
    public List<Map<String, Object>> blockFriend(String jwt, Long friendId) {
        Long requesterId = extractUserIdFromJwt(jwt);
        logger.info("Bloquear usuário: solicitante={} | amigo={}", requesterId, friendId);
        UsersPair users = validateAndGetUsers(requesterId, friendId);
        List<UserCore> result = friendsRepository.blockFriend(users.user1(), users.user2());
        return convertUsersToJson(result);
    }
}
