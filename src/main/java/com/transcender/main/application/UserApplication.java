package com.transcender.main.application;

import com.transcender.main.domain.Entity.UsuarioCore;
import com.transcender.main.domain.exceptions.BadRequest;
import com.transcender.main.domain.exceptions.ResourceNotFound;
import com.transcender.main.domain.exceptions.Unauthorized;
import com.transcender.main.domain.exceptions.UsuarioArgumentInvalid;
import com.transcender.main.domain.port.in.UserPortIn;
import com.transcender.main.domain.port.out.EncryptPortOut;
import com.transcender.main.domain.port.out.TokenGeneratorPort;
import com.transcender.main.domain.port.out.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserApplication implements UserPortIn {
    private final UserRepository userRepository;
    private final EncryptPortOut encryptPortOut;
    private final TokenGeneratorPort tokenGeneratorPort;

    @Autowired
    UserApplication(UserRepository userRepository, EncryptPortOut encryptPortOut, TokenGeneratorPort tokenGeneratorPort) {
        this.userRepository = userRepository;
        this.encryptPortOut = encryptPortOut;
        this.tokenGeneratorPort = tokenGeneratorPort;
    }

    @Override
    public UsuarioCore getUserById(Long userId) {
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
    public Map<String, Object> getProfile(UsuarioCore login) {
        Optional<UsuarioCore> user = login.getEmail() != null
                ? this.userRepository.getUserByEmail(login.getEmail())
                : this.userRepository.getUserByNickname(login.getNickname());

        if (user.isEmpty()) throw new Unauthorized("Usuário não encontrado");

        if (encryptPortOut.checkPassword(login.getSenha(), user.get().getSenha())) {
            throw new Unauthorized("Login e senha inválidos");
        }
        Map<String, Object> response = new HashMap<>();
        response.put("user", user.get());
        response.put("access_token", tokenGeneratorPort.generateToken(user.get()));
        return response;
    }

    @Override
    public UsuarioCore registerUser(UsuarioCore user) {
        user.validateCreateUser();
        user.setAtive(true);
        user.setSenha(this.encryptPortOut.encryptPassword(user.getSenha()));
        return this.userRepository.createUser(user); // salva no banco
    }

    @Override
    public UsuarioCore updateUser(String newNickname, Long userId ) {
        if (userId == null || userId <= 0) throw new BadRequest("Id inválido: deve ser positivo");
        if (newNickname == null || newNickname.trim().isEmpty()) throw new BadRequest("Nickname empty");

        UsuarioCore oldUser = userRepository
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
