package com.fullstack.devs.modules.user.model.entity;
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
    @EmbeddedId
    private UserFollowsId id;

    @ManyToOne
    @MapsId("followerId")
    @JoinColumn(name = "follower_id",nullable = false)
    private Users follower;

    @ManyToOne
    @MapsId("followingId")
    @JoinColumn (name = "following_id",nullable = false)
    private Users following;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @PrePersist
    protected void onCreated(){
        createdAt = LocalDateTime.now();
    }
}
