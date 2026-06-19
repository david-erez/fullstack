package com.fullstack.devs.modules.security.service;

import com.fullstack.devs.modules.security.config.JwtUtil;
import com.fullstack.devs.modules.security.model.dto.AuthResponse;
import com.fullstack.devs.modules.security.model.dto.LoginRequest;
import com.fullstack.devs.modules.security.model.dto.RegisterRequest;
import com.fullstack.devs.modules.security.model.entity.Token;
import com.fullstack.devs.modules.security.repository.TokenRepository;
import com.fullstack.devs.modules.user.model.entity.Users;
import com.fullstack.devs.modules.user.repository.UserRepository;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.hibernate.mapping.List;
import org.springframework.boot.webmvc.autoconfigure.WebMvcProperties;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor

public class AuthService    {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register (RegisterRequest request){
        if (userRepository.existsByEmail(request.getGmail())){
            throw new RuntimeException("the email in use");

        }
        Users userClient = new Users();
        userClient.setName(request.getUsername());
        userClient.setEmail(request.getGmail());
        userClient.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        Users savedUser = userRepository.save(userClient);
        AuthResponse response = new AuthResponse();

        response.setToken(jwtUtil.generationToken(savedUser));
        response.setTokenRefresh(jwtUtil.generationTokenRefresh(savedUser));
            response.setEmail(savedUser.getEmail());

        return response;
    }

    public  AuthResponse login(LoginRequest request){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        Users user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("user not found"));

        AuthResponse response = new AuthResponse();
        response.setToken(jwtUtil.generationToken(user));
        response.setTokenRefresh(jwtUtil.generationTokenRefresh(user));
        response.setEmail(user.getEmail());


        return response;
    }

    /*public void revokedAllUserTokens (final Users users){
    }*/


    public AuthResponse refreshToken (final String authHeader){
        if (authHeader == null ||  !authHeader.startsWith("Bearer ")){
            throw new IllegalArgumentException("invalid bearer token");
        }
        final  String refreshToken  = authHeader.substring(7);
        final  String userEmail = jwtUtil.extractingEmail(refreshToken);
        if (userEmail == null){
            throw  new IllegalArgumentException("invalid refresh token ");
        }
        final Users users = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException(userEmail));
        if (!jwtUtil.tokenValid(refreshToken,users)){
            throw new IllegalArgumentException ("Invalid refresh token");
        }
        final String accessToken = jwtUtil.generationToken(users);

        AuthResponse response = new AuthResponse();
        response.setToken(accessToken);
        response.setTokenRefresh(refreshToken);
        response.setEmail(users.getEmail());

        return response;
    }
}
