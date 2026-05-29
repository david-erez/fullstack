package com.fullstack.devs.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column (name = "user_id")
    private Long userId;
    @Column (nullable = false, unique = true, length = 30)
    private String name;
    @Column (nullable = false, unique = true, length = 50)
    private String email;
    @Column (name = "password_hash",nullable = false)
    private String passwordHash;
    @Column (name = "image_path")
    private String imagePath;
    @Column (name = "is_active")
    private boolean isActive;
    @Column (name = "created_at",updatable = false)
    private LocalDateTime createdAt;
    @Column (name = "update_at")
    private LocalDateTime updateAt;

    @PrePersist
    protected  void onCreate() {
        createdAt = LocalDateTime.now();
        updateAt =  LocalDateTime.now();
    }
    @PreUpdate
    protected  void  preUpdate(){
        updateAt = LocalDateTime.now();
    }

}
