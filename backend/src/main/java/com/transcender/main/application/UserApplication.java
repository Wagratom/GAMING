package com.transcender.main.application;

import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.exceptions.*;
import com.transcender.main.domain.port.in.UserPortIn;
import com.transcender.main.domain.port.out.EncriptyService;
import com.transcender.main.domain.port.out.JwtService;
import com.transcender.main.domain.port.out.UserRepositoryPort;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserApplication implements UserPortIn {
    private final UserRepositoryPort userRepository;
    private final EncriptyService encriptyService;
    private final JwtService jwtService;
    private static final Logger logger = LoggerFactory.getLogger(UserApplication.class);

    @Autowired
    UserApplication(UserRepositoryPort userRepository, EncriptyService encryptPortOut, JwtService jwtPortOut) {
        this.userRepository = userRepository;
        this.encriptyService = encryptPortOut;
        this.jwtService = jwtPortOut;
    }

    private Long getIdByToken(String jwt) {
        try {
            if (jwt == null) throw new BadRequest("Token não enviado");
            Map<String, Object> userInfo = jwtService.validateTokenAndGetClaims(jwt.substring(7));
            return ((Number) userInfo.get("id")).longValue();
        } catch (ExpiredJwtException err) {
            throw new Unauthorized("Token expirado amigo!");
        } catch (JwtException ex) {
            throw new Forbidden("Token inválido amigo!");
        }
    }

    private Map<String, Object> toJson(UserCore user, boolean includeMatchs) {
        return Map.of(
                "id", user.getId(),
                "nickname", user.getNickname(),
                "online", user.getOnline(),
                "avatar", user.getAvatar(),
                "criando_em", user.getCriadoEm(),
                "matchs", includeMatchs ? user.getTodasPartidas() : "null"
        );
    }

    @Override
    public Map<String, Object> getUserById(Long userId) {
        if (userId <= 0) throw new BadRequest("Id do usuario não pode ser negativo");
        return this.userRepository.getUserById(userId).map((user) -> toJson(user, false))
                .orElseThrow(() -> new ResourceNotFound("Usuario", userId));
    }

    @Override
    public List<Map<String, Object>> getUsers(Boolean online, String jwt) {

        Long solicitanteId = getIdByToken(jwt);
        logger.info("[INIT] Retornando todos os usuarios. Solicitante={} | online={}", solicitanteId, online);

        List<UserCore> users = Boolean.TRUE.equals(online) ? userRepository.getUsersOnline() : userRepository.getUsers();
        logger.info("montando json response");

        return users.stream().map((user) -> toJson(user, false)).collect(Collectors.toList());
    }

    @Override
    public String login(Optional<String> nickname, Optional<String> email, String senha) {
        logger.info("[INIT] login user | nickname={}, email={}", nickname, email);
        if (nickname.isEmpty()) throw new BadRequest("Nickname não informado");
        if (senha.isEmpty()) throw new BadRequest("Senha não informado");

        UserCore user = userRepository.getUserByNickname(nickname.get())
                .orElseThrow(() -> new Forbidden("credenciais inválidas"));

        logger.info("Usuario encontrado. Verificando password");
        if (!encriptyService.checkPassword(senha, user.getSenhaHash())) {
            throw new Forbidden("credenciais inválidas");
        }

        logger.info("Atualizando o usuario na base: online=true");
        user.setOnline(true);
        userRepository.updateUser(user);

        logger.info("Gerando token JWT");
        return jwtService.generateToken(toJson(user, false));
    }

    @Override
    public Long logout(String jwt) {
        Long userId = getIdByToken(jwt);
        logger.info("[INIT] logout user={}", userId);

        UserCore user = userRepository.getUserById(userId)
                .orElseThrow(() -> new ResourceNotFound("usuario", userId));

        user.setOnline(false);
        logger.info("Atualizando online=false");
        userRepository.updateUser(user);
        return userId;
    }

    @Override
    public Map<String, Object> getUserByToken(String jwt) {
        Long userId = getIdByToken(jwt);

        return userRepository.getUserById(userId).map((user) -> toJson(user, false))
                .orElseThrow(() -> new ResourceNotFound("Usuario", userId));
    }

    @Override
    public Map<String, Object> getProfile(String jwt) {
        Long userId = getIdByToken(jwt);

        return userRepository.getProfileById(userId).map((user) -> toJson(user, true))
                .orElseThrow(() -> new ResourceNotFound("Usuario", userId));
    }

    @Override
    public UserCore registerUser(UserCore user) {
        logger.info("UserApplication > registerUser > exec");
        if (user == null) throw new BadRequest("Usuario nulo");
        user.validateCreateUser();
        if (user.getEmail() != null && userRepository.getUserByEmail(user.getEmail()).isPresent()) {
            throw new Conflict("Esse email já esta sendo utilizado");
        }
        if (user.getNickname() != null && userRepository.getUserByNickname(user.getNickname()).isPresent()) {
            throw new Conflict("Esse nickname já esta sendo utilizado");
        }
        logger.info("Encripy password");
        user.setSenhaHash(this.encriptyService.encryptPassword(user.getSenhaHash()));
        return this.userRepository.createUser(user); // salva no banco
    }

    @Override
    public UserCore updateUser(String newNickname, Long userId) {
        if (userId == null || userId <= 0) throw new BadRequest("Id inválido: deve ser positivo");
        if (newNickname == null || newNickname.trim().isEmpty()) throw new BadRequest("Nickname empty");

        logger.info("Pegando usuario antigo DB");
        UserCore oldUser = userRepository
                .getUserById(userId)
                .orElseThrow(() -> new ResourceNotFound("Usuario", userId));

        oldUser.setNickname(newNickname);
        logger.info("Atualizando usuario");
        return userRepository.updateUser(oldUser);
    }

    @Override
    public void deleteUser(Long userId) {
        if (userId == null || userId <= 0) throw new BadRequest("Id do usuario deve ser positivo");
        this.userRepository.deleteUser(userId); //deleta o usuario
    }
}
