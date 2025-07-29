package com.transcender.main.application;

import com.transcender.main.core.Entity.UsuarioCore;
import com.transcender.main.core.exceptions.BadRequest;
import com.transcender.main.core.exceptions.ResourceNotFound;
import com.transcender.main.core.exceptions.Unauthorized;
import com.transcender.main.core.port.in.UserPortIn;
import com.transcender.main.core.port.out.EncryptPortOut;
import com.transcender.main.core.port.out.TokenGeneratorPort;
import com.transcender.main.core.port.out.UserRepository;
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
        if (userId <= 0) {
            throw new BadRequest("Id do usuario não pode ser negativo");
        }
        return this.userRepository.getUserById(userId)
                .orElseThrow(() -> new ResourceNotFound("Usuario", userId));
    }

    @Override
    public List<Map<String, Object>> getUsersOnlines() {
        return userRepository.getUsersOnlines()
                .orElse(Collections.emptyList()) // Desempacota o Optional
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
        validateInputLogin(login);

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
        validateUserForCreate(user); // valida os dados do usuário
        user.setSenha(this.encryptPortOut.encryptPassword(user.getSenha())); // criptografa a senha
        return this.userRepository.createUser(user); // salva no banco
    }

    @Override
    public UsuarioCore updateUser(UsuarioCore userUpdate) {
        if (userUpdate.getId() == null || userUpdate.getId() <= 0) throw new BadRequest("Id inválido");

        UsuarioCore oldUser = userRepository.getUserById(userUpdate.getId())
                .orElseThrow(() -> new ResourceNotFound("Usuario", userUpdate.getId()));

        if (isBlank(userUpdate.getSenha())) {
            userUpdate.setSenha(oldUser.getSenha());
        } else {
            userUpdate.setSenha(encryptPortOut.encryptPassword(userUpdate.getSenha()));
        }
        return userRepository.updateUser(userUpdate);
    }

    @Override
    public void deleteUser(Long userId) {
        if (userId == null || userId <= 0) throw new BadRequest("Id do usuario deve ser positivo");
        this.userRepository.deleteUser(userId); //deleta o usuario
    }

    public void validateInputLogin(UsuarioCore user) {
        if (user == null) throw new BadRequest("Usuario nulo, nenhum dado recebido");
        if (isBlank(user.getNickname()) && isBlank(user.getEmail())) throw new BadRequest("Login inválido: nickname ou email deve ser enviado.");
        if (isBlank(user.getSenha())) throw new BadRequest("Senha inválida: senha deve ser enviada.");

    }

    public void validateUserForCreate(UsuarioCore user) {
        if (user == null) throw new BadRequest("Usuário nulo");
        if (isBlank(user.getEmail())) throw new BadRequest("Email inválido");
        if (isBlank(user.getSenha())) throw new BadRequest("Senha inválida");
        if (isBlank(user.getNickname())) throw new BadRequest("Nickname inválido");
    }

    public boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
