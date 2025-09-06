package com.transcender.main.adapters.in.controller.dto;

import com.transcender.main.domain.entity.UserCore;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDtoRegister {
    @NotBlank(message = "O nickname não pode ser vazio ou nulo")
    private String nickname;

    @NotBlank(message = "A senha não pode ser vazia ou nula")
    private String password;

    @NotBlank(message = "O email não pode ser vazio ou nulo")
    private String email;

    private String telefone; // opcional
}