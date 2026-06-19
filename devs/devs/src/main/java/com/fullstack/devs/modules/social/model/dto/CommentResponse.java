package com.fullstack.devs.modules.social.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponse {
    private Long commentId;
    private Long postId;
    private Long userId;
    private String name;
    private String avatarUrl;
    private String content;
    private int likesCount;
    private LocalDateTime createdAt;
}
