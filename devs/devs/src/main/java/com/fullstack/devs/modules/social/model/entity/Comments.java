package com.fullstack.devs.modules.social.model.entity;

import com.fullstack.devs.modules.post.model.entity.Posts;
import com.fullstack.devs.modules.user.model.entity.Users;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Comments {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    @Column (name = "comments_id")
    private Long commentsId;
    @Column (name = "content", nullable = false, length = 500)
    private String content;
    @Column (name = "created_at")
    private LocalDateTime created_at;
    @ManyToOne
    @JoinColumn (name = "posts_id",nullable = false)
    private Posts posts;
    @ManyToOne
    @JoinColumn (name = "user_id",nullable = false)
    private Users users;

    @PrePersist
    protected void onCreated(){
        created_at = LocalDateTime.now();
    }
}
