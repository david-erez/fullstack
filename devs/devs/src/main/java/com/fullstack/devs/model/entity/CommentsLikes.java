package com.fullstack.devs.model.entity;

import com.fullstack.devs.modules.user.model.entity.Users;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table (name = "user_id")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentsLikes {
    @ManyToOne
    @JoinColumn (name = "user_id",nullable = false)
    private Users userId;
    @ManyToOne
    @JoinColumn (name = "comment_id",nullable = false)
    private Comments commentId;
    @Column (name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreated(){
        createdAt = LocalDateTime.now();
    }

}