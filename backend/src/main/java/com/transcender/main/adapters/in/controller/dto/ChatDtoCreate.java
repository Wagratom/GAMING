package com.transcender.main.adapters.in.controller.dto;

import com.transcender.main.domain.entity.ChatCore;
import com.transcender.main.domain.enuns.ChatType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class ChatDtoCreate {
        @NotBlank(message = "O nome do chat não pode ser vazio ou nulo.")
        private String chatName;

        private String descricao;

        @NotNull(message = "O tipo do chat não pode ser nulo.")
        private ChatType type;

        @NotNull(message = "O id do proprietário não pode ser nulo.")
        private Long chatOwner;

        private String password;


        public ChatCore toChatCore() {
                return new ChatCore(
                        chatName,
                        chatOwner,
                        type,
                        descricao,
                        password,
                        null
                );
        }
}
