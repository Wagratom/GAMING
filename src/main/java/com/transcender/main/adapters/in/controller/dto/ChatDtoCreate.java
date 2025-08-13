package com.transcender.main.adapters.in.controller.dto;

import com.transcender.main.domain.Entity.ChatCore;
import com.transcender.main.domain.enuns.ChatType;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatDtoCreate {

    private Long id;

    @NotBlank(message = "O nome do chat não pode ser vazio ou nulo.")
    private String chatName;

    private String descricao;

    @NotBlank(message = "O tipo do chat não pode ser vazio ou nulo.")
    private ChatType type;

    @NotBlank(message = "O id do proprietário não pode ser vazio ou nulo.")
    private Long chatOwner;

    private Set<Long> adms;


    public static ResponseEntity <Map<String, Object>> toEntity(ChatCore chat) {
        Map<String, Object> body = new HashMap<>();
        body.put("id", chat.getId());
        body.put("chatName", chat.getChatName());
        body.put("chatOwner", chat.getChatOwner());
        body.put("adms", chat.getAdms());
        body.put("type", chat.getType());
        body.put("descricao", chat.getDescricao());
        body.put("criadoEm", chat.getCriadoEm());
        body.put("atualizadoEm", chat.getAtualizadoEm());
        return ResponseEntity.ok().body(body);
    }
 }
