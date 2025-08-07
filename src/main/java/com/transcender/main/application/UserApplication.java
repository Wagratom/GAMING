package com.transcender.main.application;

import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.exceptions.*;
import com.transcender.main.domain.exceptions.InternalError;
import com.transcender.main.domain.port.in.UserPortIn;
import com.transcender.main.domain.port.out.EncryptPortOut;
import com.transcender.main.domain.port.out.JwtGeneratorPort;
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
    private final EncryptPortOut encryptPortOut;
    private final JwtGeneratorPort jwtPortOut;
    private static final Logger logger = LoggerFactory.getLogger(UserApplication.class);

    @Autowired
    UserApplication(UserRepositoryPort userRepository, EncryptPortOut encryptPortOut, JwtGeneratorPort jwtPortOut) {
        this.userRepository = userRepository;
        this.encryptPortOut = encryptPortOut;
        this.jwtPortOut = jwtPortOut;
    }

    @Override
    public UserCore getUserById(Long userId) {
        if (userId <= 0) throw new BadRequest("Id do usuario não pode ser negativo");

        return this.userRepository.getUserById(userId)
                .orElseThrow(() -> new ResourceNotFound("Usuario", userId));
    }

    @Override
    public List<Map<String, Object>> getUsers(Boolean online, Boolean friends, String jwt) {
        try {
            List<UserCore> users;

            if (Boolean.TRUE.equals(online) && Boolean.TRUE.equals(friends)) {
                Map<String, Object> claims = jwtPortOut.validateTokenAndGetClaims(jwt);
                Long userId = ((Number) claims.get("id")).longValue();
                //TODO: Corrigir aqui
                users = userRepository.getUsersOnline();
            } else if (Boolean.TRUE.equals(friends)) {
                Map<String, Object> claims = jwtPortOut.validateTokenAndGetClaims(jwt);
                Long userId = ((Number) claims.get("id")).longValue();
                users = userRepository.getFriends(userId);
            } else if (Boolean.TRUE.equals(online)) {
                users = userRepository.getUsersOnline();
            } else {
                users = userRepository.getUsers();
            }

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

        } catch (JwtException ex) {
            logger.warn("Token JWT inválido: {}", ex.getMessage());
            throw new Forbidden("Token inválido");
        } catch (Exception ex) {
            logger.error("Erro ao tentar listar os usuários", ex); // Loga com stack trace
            throw new InternalError();
        }
    }


    @Override
    public String login(Optional<String> nickname, Optional<String> email, String senha) {
        // Só um dos dois pode ser presente
        System.out.println("Iniciando validação");
        if (nickname.isPresent() && email.isPresent()) {
            throw new BadRequest("Envie apenas nickname ou email, não ambos.");
        }

        // Garante que pelo menos um foi enviado
        if (nickname.isEmpty() && email.isEmpty()) {
            throw new BadRequest("É necessário informar nickname ou email.");
        }

        // Recupera o usuário
        System.out.println("Consultando o usuario na base");
        Optional<UserCore> user = nickname.isPresent()
                ? userRepository.getUserByNickname(nickname.get())
                : userRepository.getUserByEmail(email.get());

        if (user.isEmpty()) {
            throw new ResourceNotFound("Usuário", 0L);
        }

        // Verifica a senha (se NÃO confere, lança exceção)
        System.out.println("Verificando credenciais");

        if (!encryptPortOut.checkPassword(senha, user.get().getSenha())) {
            throw new Forbidden("Efetuar login: credenciais inválidas");
        }

        // Monta o mapa com os dados do usuário
        Map<String, Object> payload = new HashMap<>();
        payload.put("id", user.get().getId());
        payload.put("email", user.get().getEmail());
        payload.put("nickname", user.get().getNickname());

        // Retorna o JWT gerado com base nos dados
        System.out.println("Gerando token de auth");
        return jwtPortOut.generateToken(payload);
    }


    @Override
    public Map<String, Object> getProfile(String headerAuth) {
        if (headerAuth == null) throw new BadRequest("Token não enviado");

        try {
            String jwt = headerAuth.startsWith("Bearer ") ? headerAuth.substring(7) : headerAuth;
            System.out.println("Decodificando o token");
            Map<String, Object> infoJwt = jwtPortOut.validateTokenAndGetClaims(jwt);

            Long id = ((Number) infoJwt.get("id")).longValue();

            UserCore user = userRepository.getUserById(id)
                    .orElseThrow(() -> new ResourceNotFound("Usuario", id));

            Map<String, Object> jsonUser = new HashMap<>();
            jsonUser.put("id", user.getId());
            jsonUser.put("nickname", user.getNickname());
            jsonUser.put("email", user.getEmail());
            jsonUser.put("online", user.getOnline());
            jsonUser.put("criando_em", user.getCriadoEm());
            return jsonUser;

        } catch (JwtException e) {
            throw new Unauthorized("Token invalido");
        }
    }


    @Override
    public UserCore registerUser(UserCore user) {
        user.validateCreateUser();
        if (user.getEmail() != null && userRepository.getUserByEmail(user.getEmail()).isPresent()) {
            throw new Conflict("Esse email já esta sendo utilizado");
        }
        if (user.getNickname() != null && userRepository.getUserByNickname(user.getNickname()).isPresent()) {
            throw new Conflict("Esse nickname já esta sendo utilizado");
        }
        user.setAtive(true);
        user.setOnline(true);
        user.setSenha(this.encryptPortOut.encryptPassword(user.getSenha()));
        try {
            return this.userRepository.createUser(user); // salva no banco
        } catch (Exception err) {
            System.out.printf("cai no exception: %s%n", err.getMessage());
            throw new InternalError();
        }
    }

    @Override
    public UserCore updateUser(String newNickname, Long userId ) {
        if (userId == null || userId <= 0) throw new BadRequest("Id inválido: deve ser positivo");
        if (newNickname == null || newNickname.trim().isEmpty()) throw new BadRequest("Nickname empty");

        UserCore oldUser = userRepository
                .getUserById(userId)
                .orElseThrow(() -> new ResourceNotFound("Usuario", userId));

        oldUser.setNickname(newNickname);
        return userRepository.updateUser(oldUser);
    }

    @Override
    public void deleteUser(Long userId) {
        if (userId == null || userId <= 0) throw new BadRequest("Id do usuario deve ser positivo");
        this.userRepository.deleteUser(userId); //deleta o usuario
    }

    public boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
