package com.transcender.main.application;

import com.transcender.main.domain.entity.FriendCore;
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

    private Map<String, Object> convertUserToJson(FriendCore friend) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", friend.id());

        // Quem enviou o pedido
        Map<String, Object> sender = new HashMap<>();
        sender.put("id", friend.sender().getId());
        sender.put("nickname", friend.sender().getNickname());
        sender.put("avatar", friend.sender().getAvatar());
        sender.put("online", friend.sender().getOnline());
        sender.put("createdAt", friend.sender().getCriadoEm());
        map.put("sender", sender);

        // Quem recebeu o pedido
        Map<String, Object> receiver = new HashMap<>();
        receiver.put("id", friend.received().getId());
        receiver.put("nickname", friend.received().getNickname());
        receiver.put("avatar", friend.received().getAvatar());
        receiver.put("online", friend.received().getOnline());
        receiver.put("createdAt", friend.received().getCriadoEm());
        map.put("receiver", receiver);

        // Dados da amizade
        map.put("status", friend.status().name());
        map.put("createdAt", friend.criadoEm());
        map.put("updatedAt", friend.atualizadoEm());

        return map;
    }
    private List<Map<String, Object>> convertUsersToJson(List<FriendCore> friends) {
        return friends.stream()
                .map(this::convertUserToJson)
                .collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getFriends(String jwt, FriendStatus status) {
        Long userId = extractUserIdFromJwt(jwt);
        FriendStatus effectiveStatus = status != null ? status : FriendStatus.ACCEPTED;
        logger.info("Obtendo amigos do usuário {} com status {}", userId, effectiveStatus);
        List<FriendCore> friend = friendsRepository.getFriendsCore(userId, effectiveStatus);
        return convertUsersToJson(friend);
    }

    @Override
    public Map<String, Object> addFriend(String jwt, Long friendId) {
        Long requesterId = extractUserIdFromJwt(jwt);
        logger.info("Solicitação de amizade: solicitante={} | amigo={}", requesterId, friendId);
        UsersPair users = validateAndGetUsers(requesterId, friendId);
        return convertUserToJson(friendsRepository.addFriend(users.user1(), users.user2()));
    }

    @Override
    public Map<String, Object> acceptFriend(String jwt, Long friendId) {
        Long requesterId = extractUserIdFromJwt(jwt);
        logger.info("Aceitar amizade: solicitante={} | amigo={}", requesterId, friendId);
        UsersPair users = validateAndGetUsers(requesterId, friendId);
        return convertUserToJson(friendsRepository.acceptFriend(users.user1(), users.user2()));
    }

    @Override
    public Map<String, Object> declineFriend(String jwt, Long friendId) {
        Long requesterId = extractUserIdFromJwt(jwt);
        logger.info("Aceitar amizade: solicitante={} | amigo={}", requesterId, friendId);
        UsersPair users = validateAndGetUsers(requesterId, friendId);
        return convertUserToJson(friendsRepository.declineFriend(users.user1(), users.user2()));
    }

    @Override
    public Map<String, Object> removeFriend(String jwt, Long friendId) {
        Long requesterId = extractUserIdFromJwt(jwt);
        logger.info("Remover amizade: solicitante={} | amigo={}", requesterId, friendId);
        UsersPair users = validateAndGetUsers(requesterId, friendId);
        return convertUserToJson(friendsRepository.removeFriend(users.user1(), users.user2()));
    }

    @Override
    public Map<String, Object> blockFriend(String jwt, Long friendId) {
        Long requesterId = extractUserIdFromJwt(jwt);
        logger.info("Bloquear usuário: solicitante={} | amigo={}", requesterId, friendId);
        UsersPair users = validateAndGetUsers(requesterId, friendId);
        return convertUserToJson(friendsRepository.blockFriend(users.user1(), users.user2()));
    }
}
