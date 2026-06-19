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
public class LikeResponse {
    private Long userId;
    private String name;
    private String avatarUrl;
/*la idea es ques esto se adapte en post y comments*/
    private Long targetId;
    private String targetType;
    private LocalDateTime createdAt;
}
