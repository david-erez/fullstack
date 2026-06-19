package com.fullstack.devs.modules.security.config;


import com.fullstack.devs.modules.user.model.entity.Users;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.Keys;
import jakarta.persistence.Id;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import io.jsonwebtoken.Jwts;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.Map;

@Component
public class JwtUtil {
    @Value("${application.security.jwt.secret-key}")
    private String secretKey;
    @Value("${application.security.jwt.expiration}")
    private long expiration;
    @Value("${application.security.jwt.refresh-token.expiration}")
    private long expirationRefresh;


    private Key getSigningKey(){
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String  extractingEmail(final String token){
            final Claims jwtToken = Jwts.parser()
                    .verifyWith((javax.crypto.SecretKey) getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return jwtToken.getSubject();
    }
    public String generationToken(final Users users){

        return buildToken(users,expiration);
    }


    public String generationTokenRefresh (final Users users){
        return buildToken(users,expirationRefresh);

    }

    private String buildToken(final Users users, final long expiration){
        return Jwts.builder()
                .id(users.getUserId().toString())
                .claims(Map.of("name",users.getName()))
                .subject(users.getEmail())
                .issuedAt(new Date())
                .expiration(new Date (System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public boolean tokenValid (String token,Users users){
        try {
            return extractingEmail(token).equals(users.getEmail()) && !tokenSpired(token);
        }catch (JwtException e){
            return false;
        }
    }

    public boolean tokenSpired(String token){
    return Jwts.parser()
            .verifyWith((javax.crypto.SecretKey) getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .getExpiration()
            .before(new Date());

    }
}
