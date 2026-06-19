package com.fullstack.devs.modules.security.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private String tokenRefresh;
}
