package com.fullstack.devs.model.entity;

import com.fullstack.devs.modules.user.model.entity.Users;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table (name = "posts")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class Posts {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    @Column (name = "posts_id")
    private Long postsId;
    @Column (name = "content",nullable = false,length = 280)
    private String content;
    @Column (name = "is_visible")
    private boolean isVisible;
    @Column (name = "created_at",updatable = false)
    private LocalDateTime createdAt;
    @Column (name = "update_at")
    private LocalDateTime updateAt;
    @ManyToOne
    @JoinColumn(name = "user_id",nullable = false)
    private Users users;

    @PrePersist
    protected void onCreate(){
        createdAt = LocalDateTime.now();
        updateAt = LocalDateTime.now();
    }

    @PreUpdate
    protected  void preUpdate(){
        updateAt = LocalDateTime.now();
    }


}
