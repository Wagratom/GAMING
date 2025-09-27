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
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendsApplication implements FriendsPort {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepositoryPort userRepository;
    private final FriendsRepositoryPort friendsRepository;
    private final JwtService jwtService;

    private static final Logger logger = LoggerFactory.getLogger(FriendsApplication.class);

    private record UsersPair(UserCore requester, UserCore friend) {}

    private Long extractUserIdFromJwt(String jwt) {
        if (jwt == null) throw new BadRequest("Token não enviado");
        try {
            Map<String, Object> userInfo = jwtService.validateTokenAndGetClaims(jwt.substring(7));
            return ((Number) userInfo.get("id")).longValue();
        } catch (ExpiredJwtException err) {
            throw new Unauthorized("Token expirado amigo!");
        } catch (JwtException ex) {
            throw new Unauthorized("Token inválido amigo!");
        }
    }

    public UsersPair getAndValidateUsers(Long requesterId, Long friendId) {
        UserCore requester = userRepository.getUserById(requesterId)
                .orElseThrow(() -> new ResourceNotFound("UsuarioSolicitante", requesterId));

        UserCore friend = userRepository.getUserById(friendId)
                .orElseThrow(() -> new ResourceNotFound("Usuario", friendId));

        if (requester.getId().equals(friend.getId())) {
            throw new BadRequest("O usuário não pode adicionar ele mesmo");
        }

        return new UsersPair(requester, friend);
    }

    private void validateFriendShip(FriendCore friendship, UserCore requester, UserCore receiver) {
        if (friendship.received().equals(requester)) {
            throw new BadRequest("O usuário não pode responder à solicitação que ele mesmo enviou");
        }
        if (friendship.status().equals(FriendStatus.BLOCKED)) {
            throw new BadRequest("A amizade está bloqueada");
        }
    }

    private Map<String, Object> userToJson(UserCore user) {
        Map<String, Object> json = new HashMap<>();
        json.put("id", user.getId());
        json.put("nickname", user.getNickname());
        json.put("avatar", user.getAvatar());
        json.put("online", user.getOnline());
        json.put("createdAt", user.getCriadoEm());

        return json;
    }

    private Map<String, Object> notificationsToJson(FriendCore friendShip) {
        Map<String, Object> map = new HashMap<>();

        // Dados da amizade
        map.put("id", friendShip.id());
        map.put("status", friendShip.status().name());
        map.put("createdAt", friendShip.criadoEm());
        map.put("updatedAt", friendShip.atualizadoEm());

        // Quem enviou o pedido
        map.put("sender", userToJson(friendShip.sender()));

        // Quem recebeu o pedido
        map.put("receiver", userToJson(friendShip.received()));
        return map;
    }

    public List<Map<String, Object>> getFriends(String jwt, FriendStatus status) {
        Long userId = extractUserIdFromJwt(jwt);
        FriendStatus effectiveStatus = status != null ? status : FriendStatus.ACCEPTED;
        logger.info("Obtendo amigos do usuário {} com status {}", userId, effectiveStatus);

        List<FriendCore> friends = friendsRepository.getFriendsCore(userId, effectiveStatus);
        return friends.stream().map((friendShip) -> {
            if (friendShip.received().getId().equals(userId)) {
                return userToJson(friendShip.sender());
            } else {
                return userToJson(friendShip.received());
            }
        }).collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getFriendsNotication(String jwt, FriendStatus status) {
        Long userId = extractUserIdFromJwt(jwt);
        FriendStatus effectiveStatus = status != null ? status : FriendStatus.ACCEPTED;
        logger.info("Obtendo amigos do usuário {} com status {}", userId, effectiveStatus);

        List<FriendCore> friends = friendsRepository.getFriendsCore(userId, effectiveStatus);
        return friends.stream()
                .map(this::notificationsToJson)
                .collect(Collectors.toList());
    }

    @Override
    public void addFriend(String jwt, Long friendId) {
        Long requesterId = extractUserIdFromJwt(jwt);
        logger.info("Solicitação de amizade: solicitante={} | amigo={}", requesterId, friendId);

        UsersPair users = getAndValidateUsers(requesterId, friendId);
        messagingTemplate.convertAndSend("/topic/friends/" + friendId,
                notificationsToJson(friendsRepository.addFriend(users.requester(), users.friend()))
        );
    }

    @Override
    public void acceptFriend(String jwt, Long friendId) {
        Long requesterId = extractUserIdFromJwt(jwt);
        logger.info("Aceitar amizade: solicitante={} | amigo={}", requesterId, friendId);

        UsersPair users = getAndValidateUsers(requesterId, friendId);
        messagingTemplate.convertAndSend("/topic/friends/" + requesterId,
                notificationsToJson(friendsRepository.acceptFriend(users.requester(), users.friend()))
        );
    }

    @Override
    public void declineFriend(String jwt, Long friendId) {
        Long requesterId = extractUserIdFromJwt(jwt);
        logger.info("Recusar amizade: solicitante={} | amigo={}", requesterId, friendId);

        UsersPair users = getAndValidateUsers(requesterId, friendId);
        FriendCore friendship = friendsRepository.getFriendCore(requesterId, friendId)
                .orElseThrow(() -> new BadRequest("Amizade não encontrada"));

        validateFriendShip(friendship, users.requester(), users.friend());
        messagingTemplate.convertAndSend("/topic/friends/" + requesterId,
                notificationsToJson(friendsRepository.declineFriend(users.requester(), users.friend()))
        );
    }

    @Override
    public void removeFriend(String jwt, Long friendId) {
        Long requesterId = extractUserIdFromJwt(jwt);
        logger.info("Remover amizade: solicitante={} | amigo={}", requesterId, friendId);

        UsersPair users = getAndValidateUsers(requesterId, friendId);
        FriendCore friendship = friendsRepository.getFriendCore(requesterId, friendId)
                .orElseThrow(() -> new BadRequest("Amizade não encontrada"));

        validateFriendShip(friendship, users.requester(), users.friend());
        messagingTemplate.convertAndSend(
                "/topic/friends/" + friendId,
                notificationsToJson(friendsRepository.removeFriend(users.requester(), users.friend()))
        );
    }

    @Override
    public void blockFriend(String jwt, Long friendId) {
        Long requesterId = extractUserIdFromJwt(jwt);
        logger.info("Bloquear usuário: solicitante={} | amigo={}", requesterId, friendId);

        UsersPair users = getAndValidateUsers(requesterId, friendId);
        FriendCore friendship = friendsRepository.getFriendCore(requesterId, friendId)
                .orElseThrow(() -> new BadRequest("Amizade não encontrada"));

        if (friendship.received().equals(users.requester())) {
            throw new BadRequest("O usuário não pode bloquear a si mesmo");
        }

        messagingTemplate.convertAndSend(
                "/topic/friends/" + friendId,
                notificationsToJson(friendsRepository.removeFriend(users.requester(), users.friend()))
        );
    }
}
