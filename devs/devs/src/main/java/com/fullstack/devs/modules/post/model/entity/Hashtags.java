package com.fullstack.devs.modules.post.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table (name = "hashtags")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class Hashtags {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hashtags_id")
    private Long hashtagsId;
    @Column(nullable = false, length = 100, unique = true)
    private String tag;
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreated() {
        createdAt = LocalDateTime.now();
    }
}
