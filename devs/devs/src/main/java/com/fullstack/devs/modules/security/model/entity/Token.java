package com.fullstack.devs.modules.security.model.entity;

import com.fullstack.devs.modules.user.model.entity.Users;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "token_acces")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Token {

    public  enum TokenType{
        BEARER
    }
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column(name = "token_id")
    private Long tokenId;

    @ManyToOne
    @JoinColumn (name = "user_id",nullable = false)
    private Users users;

    @Column (nullable = false,length = 512)
    private  TokenType token = TokenType.BEARER;

    @Column (name = "is_valid",nullable = false)
    private boolean isValid = true;

    @Column (name = "created_at")
    private LocalDateTime createAt;

    @Column (name = "expired")
    private  boolean expired;

    @Column (name = "revoked")
    private  boolean revoked;

    @PrePersist
    protected void onCreated (){
        createAt = LocalDateTime.now();
    }



}
