package com.fullstack.devs.modules.security.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String username;
    private String gmail;
    private String  password;
}
