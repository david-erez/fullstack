package com.fullstack.devs.modules.security.controller;

import com.fullstack.devs.modules.security.model.dto.AuthResponse;
import com.fullstack.devs.modules.security.model.dto.LoginRequest;
import com.fullstack.devs.modules.security.model.dto.RegisterRequest;
import com.fullstack.devs.modules.security.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AutController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register (@RequestBody final RegisterRequest request ){
        final AuthResponse tokenResponse = authService.register(request);
        return ResponseEntity.ok(tokenResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login (@RequestBody final LoginRequest request){
        final  AuthResponse tokenResponse = authService.login(request);
        return ResponseEntity.ok(tokenResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh (@RequestHeader(HttpHeaders.AUTHORIZATION) final  String authHeader){
        return ResponseEntity.ok(authService.refreshToken(authHeader));
    }
}
