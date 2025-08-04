package com.transcender.main.application;

import com.transcender.main.domain.entity.UserCore;
import com.transcender.main.domain.exceptions.BadRequest;
import com.transcender.main.domain.exceptions.Forbidden;
import com.transcender.main.domain.exceptions.InternalError;
import com.transcender.main.domain.exceptions.ResourceNotFound;
import com.transcender.main.domain.exceptions.Unauthorized;
import com.transcender.main.domain.port.in.UserPortIn;
import com.transcender.main.domain.port.out.EncryptPortOut;
import com.transcender.main.domain.port.out.JwtGeneratorPort;
import com.transcender.main.domain.port.out.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserApplication implements UserPortIn {
    private final UserRepository userRepository;
    private final EncryptPortOut encryptPortOut;
    private final JwtGeneratorPort jwtPortOut;

    @Autowired
    UserApplication(UserRepository userRepository, EncryptPortOut encryptPortOut, JwtGeneratorPort jwtPortOut) {
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
    public List<Map<String, Object>> getUsersOnlines() {
        return userRepository.getUsersOnlines()
                .stream()
                .map(user -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("nickname", user.getNickname()); // Verifique se esse método existe
                    map.put("online", user.getOnline()); // E esse também
                    return map;
                })
                .collect(Collectors.toList());
    }

    @Override
    public String login(Optional<String> nickname, Optional<String> email, String senha) {
        // Só um dos dois pode ser presente
        if (nickname.isPresent() && email.isPresent()) {
            throw new BadRequest("Envie apenas nickname ou email, não ambos.");
        }

        // Garante que pelo menos um foi enviado
        if (nickname.isEmpty() && email.isEmpty()) {
            throw new BadRequest("É necessário informar nickname ou email.");
        }

        // Recupera o usuário
        Optional<UserCore> user = nickname.isPresent()
                ? userRepository.getUserByNickname(nickname.get())
                : userRepository.getUserByEmail(email.get());

        if (user.isEmpty()) {
            throw new ResourceNotFound("Usuário", 0L);
        }

        // Verifica a senha (se NÃO confere, lança exceção)
        if (!encryptPortOut.checkPassword(senha, user.get().getSenha())) {
            throw new Forbidden("Efetuar login: credenciais inválidas");
        }

        // Monta o mapa com os dados do usuário
        Map<String, Object> payload = new HashMap<>();
        payload.put("id", user.get().getId());
        payload.put("email", user.get().getEmail());
        payload.put("nickname", user.get().getNickname());

        // Retorna o JWT gerado com base nos dados
        return jwtPortOut.generateToken(payload);
    }


    @Override
    public Map<String, Object> getProfile(UserCore login) {
        Optional<UserCore> user = login.getEmail() != null
                ? this.userRepository.getUserByEmail(login.getEmail())
                : this.userRepository.getUserByNickname(login.getNickname());

        if (user.isEmpty()) throw new Unauthorized("Usuário não encontrado");

        if (encryptPortOut.checkPassword(login.getSenha(), user.get().getSenha())) {
            throw new Unauthorized("Login e senha inválidos");
        }
        Map<String, Object> response = new HashMap<>();
        response.put("user", user.get());
        return response;
    }

    @Override
    public UserCore registerUser(UserCore user) {
        try {
            user.validateCreateUser();
            user.setAtive(true);
            user.setSenha(this.encryptPortOut.encryptPassword(user.getSenha()));
            Map<String, Object> map = new HashMap<>();
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
