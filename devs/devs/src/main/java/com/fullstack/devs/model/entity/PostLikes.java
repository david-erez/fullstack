package com.fullstack.devs.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "post_likes")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostLikes {
    @ManyToOne
    @JoinColumn ( name = "user_id",nullable = false)
    private Users users;
    @ManyToOne
    @JoinColumn (name = "post_id",nullable = false)
    private Posts posts;
    @Column (name = "created_at")
    private LocalDateTime created_At;
    @PrePersist
    protected void onCreated(){
        created_At = LocalDateTime.now();
    }

}
