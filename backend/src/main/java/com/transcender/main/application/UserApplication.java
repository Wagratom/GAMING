package com.transcender.main.application;

import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.exceptions.*;
import com.transcender.main.domain.port.in.UserPortIn;
import com.transcender.main.domain.port.out.EncriptyService;
import com.transcender.main.domain.port.out.JwtService;
import com.transcender.main.domain.port.out.UserRepositoryPort;
import io.jsonwebtoken.JwtException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
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

    @Override
    public UserCore getUserById(Long userId) {
        if (userId <= 0) throw new BadRequest("Id do usuario não pode ser negativo");

        return this.userRepository.getUserById(userId)
                .orElseThrow(() -> new ResourceNotFound("Usuario", userId));
    }

    @Override
    public List<Map<String, Object>> getUsers(Boolean online, String jwt) {
        try {
            Map<String, Object> claims = jwtService.validateTokenAndGetClaims(jwt.substring(7));
            List<UserCore> users;

            if (Boolean.TRUE.equals(online)) {
                logger.info("Pegando todos os usuarios onlines");
                users = userRepository.getUsersOnline();
            } else {
                logger.info("Pegando todos os usuarios");
                users = userRepository.getUsers();
            }

            return users.stream()
                    .map(user -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", user.getId());
                        map.put("nickname", user.getNickname());
                        map.put("online", user.getOnline());
                        map.put("avatar", user.getAvatar());
                        map.put("criando_em", user.getCriadoEm());
                        return map;
                    })
                    .collect(Collectors.toList());

        } catch (JwtException ex) {
            logger.error("Token JWT inválido: {}", ex.getMessage());
            throw new Forbidden("Token inválido");
        }
    }

    @Override
    public String login(Optional<String> nickname, Optional<String> email, String senha) {
        logger.info("UserApplication > login > exec");
        if (nickname.isPresent() && email.isPresent()) {
            throw new BadRequest("Envie apenas nickname ou email, não ambos.");
        }

        // Garante que pelo menos um foi enviado
        if (nickname.isEmpty() && email.isEmpty()) {
            throw new BadRequest("É necessário informar nickname ou email.");
        }

        logger.info("Consultando o usuario na base");
        UserCore user = nickname
                .map(nick -> userRepository.getUserByNickname(nick)
                        .orElseThrow(() -> new Forbidden("credenciais inválidas")))
                .orElseGet(() -> userRepository.getUserByEmail(email.get())
                        .orElseThrow(() -> new Forbidden("credenciais inválidas")));

        logger.info("Verificando password");
        if (!encriptyService.checkPassword(senha, user.getSenhaHash())) {
            throw new Forbidden("credenciais inválidas");
        }

        user.setOnline(true);
        logger.info("Atualizando o usuario na base: online=true");
        userRepository.updateUser(user);

        // Monta o mapa com os dados do usuário
        Map<String, Object> payload = Map.of(
                "id", user.getId(),
                "nickname", user.getNickname() != null ? user.getNickname() : "",
                "email",  user.getEmail()!= null ? user.getEmail()  : ""
        );

        // Retorna o JWT gerado com base nos dados
        logger.info("Gerando token JWT");
        return jwtService.generateToken(payload);
    }

    @Override
    public void logout(String jwt) {
        try {
            logger.info("Validando token jwt");
            Map<String, Object> userInfo = jwtService.validateTokenAndGetClaims(jwt.substring(7));
            Long id = ((Number) userInfo.get("id")).longValue();

            logger.info("Consultando o usuario na base");
            UserCore user = userRepository.getUserById(id)
                    .orElseThrow(() -> new ResourceNotFound("usuario", id));

            user.setOnline(false);
            logger.info("Atualizando o usuario na base");
            userRepository.updateUser(user);
        } catch (JwtException ex) {
            logger.error("Erro ao tentar decodificar o token", ex); // Loga com stack trace
            throw new Forbidden("Token inválido");
        }
    }

    @Override
    public Map<String, Object> getProfile(String headerAuth) {
        if (headerAuth == null) throw new BadRequest("Token não enviado");

        try {
            String jwt = headerAuth.startsWith("Bearer ") ? headerAuth.substring(7) : headerAuth;
            Map<String, Object> infoJwt = jwtService.validateTokenAndGetClaims(jwt);

            Long id = ((Number) infoJwt.get("id")).longValue();

            UserCore user = userRepository.getUserById(id)
                    .orElseThrow(() -> new ResourceNotFound("Usuario", id));

            Map<String, Object> jsonUser = Map.of(
                    "id", user.getId(),
                    "nickname", user.getNickname() != null ? user.getNickname() : "",
                    "email",  user.getEmail()!= null ? user.getEmail()  : "",
                    "avatar", user.getAvatar(),
                    "online", user.getOnline(),
                    "criando_em", user.getCriadoEm()
            );

            return jsonUser;

        } catch (JwtException ex) {
            logger.error("Erro ao tentar decodificar o token", ex); // Loga com stack trace
            throw new Unauthorized("Token invalido");
        }
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
    public UserCore updateUser(String newNickname, Long userId ) {
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
