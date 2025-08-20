package com.transcender.main.adapters.in.controller.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDtoPut extends UserDtoRegister {

    @NotNull(message = "O ID não pode ser nulo")
    private Long id;

    public UserDtoPut() {
        super();
    }
}
