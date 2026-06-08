package com.fullstack.devs.modules.post.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class PostResponse {
    private Long userId;
    private Long postId;
    private String content;
    private String name;
    private int likes;
    private int comments;
    private List<String> hashtags;
    private Boolean isVisible;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
