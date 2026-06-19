package com.fullstack.devs.modules.social.model.entity;

import com.fullstack.devs.modules.user.model.entity.Users;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table (name = "comments_likes")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentsLikes {
    @EmbeddedId
    private CommentsLikesId id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn (name = "user_id",nullable = false)
    private Users userId;

    @ManyToOne
    @MapsId("commentId")
    @JoinColumn (name = "comment_id",nullable = false)
    private Comments commentId;
    @Column (name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreated(){
        createdAt = LocalDateTime.now();
    }

}
