package com.transcender.main.adapters.in.controller.dto;

import com.transcender.main.domain.Entity.UserCore;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
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


        public static ResponseEntity<Map<String, Object>> toEntity(UserCore user) {
                Map<String, Object> body = new HashMap<>();
                body.put("id", user.getId());
                body.put("nickname", user.getNickname());
                body.put("email", user.getEmail());
                body.put("online", user.getOnline());
                body.put("telefone", user.getTelefone());
                body.put("atualizado_em", user.getAtualizadoEm());
                body.put("criado_em", user.getCriadoEm());
                return ResponseEntity.ok().body(body);
        }
}
