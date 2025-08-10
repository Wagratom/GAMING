package com.transcender.main.application;

import com.transcender.main.domain.entity.UserCore;
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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FriendsApplication implements FriendsPort {
    private final UserRepositoryPort userRepository;
    private final FriendsRepositoryPort friendsRepository;
    private final JwtService jwtService;
    private Logger logger = LoggerFactory.getLogger(FriendsApplication.class);

    @Autowired
    public FriendsApplication(UserRepositoryPort userRepository, JwtService jwtService, FriendsRepositoryPort friendsRepository) {
        this.userRepository = userRepository;
        this.friendsRepository = friendsRepository;
        this.jwtService = jwtService;
    }

    public Long getIdJwt(String jwt) {
        try {
            Map<String, Object> userInfo = jwtService.validateTokenAndGetClaims(jwt.substring(7));
            return ((Number) userInfo.get("id")).longValue();
        } catch (JwtException ex) {
            logger.error("Erro ao tentar decodificar o token", ex); // Loga com stack trace
            throw new Unauthorized("Token invalido");
        }
    };

    @Override
    public List<Map<String, Object>> getFriends(String jwt) {
        try {
            return toJson(friendsRepository.getFriends(getIdJwt(jwt)));
        } catch (JwtException ex) {
            logger.error("Erro ao tentar decodificar o token", ex); // Loga com stack trace
            throw new Unauthorized("Token invalido");
        }
    }

    @Override
    public boolean addFriend(String jwt, Long friendId) {
        try {
            Long solicitanteId = getIdJwt(jwt);
            logger.info("FriendsApplication > addFriend > Solicitante: {} | FriendId {}", solicitanteId, friendId);

            UserCore user1 = userRepository.getUserById(solicitanteId)
                    .orElseThrow(() -> new ResourceNotFound("UsuarioSolicitante", solicitanteId));

            UserCore user2 = userRepository.getUserById(friendId)
                    .orElseThrow(() -> new ResourceNotFound("Usuario", friendId));

            if (user1.getId().equals(user2.getId())) throw new BadRequest("O usuario não pode adicionar ele mesmo");

            logger.info("Verificando se o usuario nao esta bloqueado");
            if (friendsRepository.existsBlock(user1.getId(), user2.getId()))  {
                new BadRequest("Não é permitido adicionar um usuário bloqueado.");
            }
            //TODO EU TENHO QUE CRIAR A ENTTITY AQUI E NAO LA
            return this.friendsRepository.addFriend(user1, user2);
        } catch (JwtException ex) {
            logger.error("Erro ao tentar decodificar o token", ex); // Loga com stack trace
            throw new Unauthorized("Token invalido");
        }
    }

    @Override
    public List<Map<String, Object>> removeFriend(String jwt, Long friendId) {
        return toJson(friendsRepository.removeFriend(getIdJwt(jwt), friendId));
    }

    @Override
    public List<Map<String, Object>> blockFriend(String jwt, Long friendId) {
        return toJson(friendsRepository.blockFriend(getIdJwt(jwt), friendId));
    }

    private List<Map<String, Object>> toJson(List<UserCore> users) {
        return users.stream()
                .map((user) -> {
                    Map<String, Object> map = new HashMap<>(3);
                    map.put("id", user.getId());
                    map.put("nickname", user.getNickname());
                    map.put("online", user.getOnline());
                    map.put("criando_em", user.getCriadoEm());
                    return map;
                }).collect(Collectors.toList());
    }
}
