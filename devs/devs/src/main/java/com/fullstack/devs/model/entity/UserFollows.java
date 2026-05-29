package com.fullstack.devs.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table (name = "user_follows")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserFollows {
    @ManyToOne
    @JoinColumn(name = "follower_id",nullable = false)
    private Users followerId;
    @ManyToOne
    @JoinColumn (name = "following_id",nullable = false)
    private Users following_id;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @PrePersist
    protected void onCreated(){
        createdAt = LocalDateTime.now();
    }
}
