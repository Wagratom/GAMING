package com.transcender.main.application;

import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.exceptions.*;
import com.transcender.main.domain.port.in.UserPortIn;
import com.transcender.main.domain.port.out.EncriptyService;
import com.transcender.main.domain.port.out.JwtService;
import com.transcender.main.domain.port.out.UserRepositoryPort;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserApplication implements UserPortIn {

    private final UserRepositoryPort userRepository;
    private final EncriptyService encriptyService;
    private final JwtService jwtService;
    private static final Logger logger = LoggerFactory.getLogger(UserApplication.class);

    private Long getIdByToken(String jwt) {
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

    @Override
    public UserCore getUserById(Long userId) {
        if (userId <= 0) throw new BadRequest("Id do usuário não pode ser negativo");
        return this.userRepository.getUserById(userId)
                .orElseThrow(() -> new ResourceNotFound("Usuario", userId));
    }

    @Override
    public List<UserCore> getUsers(Boolean online, String jwt) {
        Long solicitanteId = getIdByToken(jwt);
        logger.info("[INIT] Retornando todos os usuários. Solicitante={} | online={}", solicitanteId, online);

        List<UserCore> users = Boolean.TRUE.equals(online) ? userRepository.getUsersOnline() : userRepository.getUsers();
        logger.info("Retornando lista de usuários");
        return users;
    }

    @Override
    public String login(Optional<String> nickname, Optional<String> email, String senha) {
        logger.info("[INIT] login user | nickname={}, email={}", nickname, email);
        if (nickname.isEmpty()) throw new BadRequest("Nickname não informado");
        if (senha.isEmpty()) throw new BadRequest("Senha não informado");

        UserCore user = userRepository.getUserByNickname(nickname.get())
                .orElseThrow(() -> new Forbidden("Credenciais inválidas"));

        logger.info("Usuário encontrado. Verificando password");
        if (!encriptyService.checkPassword(senha, user.getSenhaHash())) {
            throw new Forbidden("Credenciais inválidas");
        }

        logger.info("Atualizando o usuário na base: online=true");
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
    public UserCore getUserByToken(String jwt) {
        Long userId = getIdByToken(jwt);
        return userRepository.getUserById(userId)
                .orElseThrow(() -> new ResourceNotFound("Usuario", userId));
    }

    @Override
    public UserCore getProfile(String jwt, Long userId) {
        getIdByToken(jwt);
        logger.info("[INIT] pegando profile do usuario {}", userId);
        return userRepository.getProfileById(userId)
                .orElseThrow(() -> new ResourceNotFound("Usuario", userId));
    }

    @Override
    public UserCore registerUser(UserCore user) {
        logger.info("UserApplication > registerUser > exec");
        if (user == null) throw new BadRequest("Usuário nulo");
        user.validateCreateUser();
        if (user.getEmail() != null && userRepository.getUserByEmail(user.getEmail()).isPresent()) {
            throw new Conflict("Esse email já está sendo utilizado");
        }
        if (user.getNickname() != null && userRepository.getUserByNickname(user.getNickname()).isPresent()) {
            throw new Conflict("Esse nickname já está sendo utilizado");
        }
        logger.info("Encriptando senha");
        user.setSenhaHash(this.encriptyService.encryptPassword(user.getSenhaHash()));
        return this.userRepository.createUser(user);
    }

    @Override
    public UserCore updateUser(String newNickname, Long userId) {
        if (userId == null || userId <= 0) throw new BadRequest("Id inválido: deve ser positivo");
        if (newNickname == null || newNickname.trim().isEmpty()) throw new BadRequest("Nickname vazio");

        logger.info("Pegando usuário antigo DB");
        UserCore oldUser = userRepository.getUserById(userId)
                .orElseThrow(() -> new ResourceNotFound("usuário", userId));

        oldUser.setNickname(newNickname);
        logger.info("Atualizando usuário");
        UserCore newUser = userRepository.updateUser(oldUser);
        newUser.setSenhaHash(""); // remove hash antes de expor
        return newUser;
    }

    @Override
    public void deleteUser(Long userId) {
        if (userId == null || userId <= 0) throw new BadRequest("Id do usuário deve ser positivo");
        this.userRepository.deleteUser(userId);
    }

    // Mantém método auxiliar privado toJson se necessário
    private Map<String, Object> toJson(UserCore user, boolean includeDetails) {
        // Implementar lógica de conversão para Map<String,Object> se quiser manter getProfile
        return Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "nickname", user.getNickname(),
                "avatar", user.getAvatar(),
                "online", user.getOnline()
        );
    }
}
