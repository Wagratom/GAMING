package com.transcender.main.application;

import com.transcender.main.domain.entity.UserCore;
=import com.transcender.main.domain.exceptions.BadRequest;
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

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    @Override
    public List<Map<String, Object>> getFriends(String jwt) {
        try {
            Map<String, Object> userInfo = jwtService.validateTokenAndGetClaims(jwt);
            Long id = ((Number) userInfo.get("id")).longValue();

            List<UserCore> users = userRepository.getFriends(id);
            return users.stream()
                    .map((user) -> {
                        Map<String, Object> map = new HashMap<>(3);
                        map.put("id", user.getId());
                        map.put("nickname", user.getNickname());
                        map.put("online", user.getOnline());
                        map.put("criando_em", user.getCriadoEm());
                        return map;
                    }).collect(Collectors.toList());
        } catch (JwtException ex) {
            logger.error("Erro ao tentar decodificar o token", ex); // Loga com stack trace
            throw new Unauthorized("Token invalido");
        }
    }

    @Override
    public boolean addFriend(Long userId, String jwt) {
        try {
            Map<String, Object> userInfo = jwtService.validateTokenAndGetClaims(jwt);
            Long idUserSolicitante = ((Number) userInfo.get("id")).longValue();

            UserCore user1 = userRepository.getUserById(idUserSolicitante)
                    .orElseThrow(() -> new ResourceNotFound("UsuarioSolicitante", idUserSolicitante));

            UserCore user2 = userRepository.getUserById(userId)
                    .orElseThrow(() -> new ResourceNotFound("Usuario", userId));

            if (user1.getId().equals(user2.getId())) throw new BadRequest("O usuario não pode adicionar ele mesmo");

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
    public List<FriendsPort> removeFriend(Long userId, String jwt) {
        return List.of();
    }

    @Override
    public List<FriendsPort> blockFriend(Long userId, String jwt) {
        return List.of();
    }
}
