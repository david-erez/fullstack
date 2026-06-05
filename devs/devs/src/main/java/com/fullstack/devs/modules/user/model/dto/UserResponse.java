package com.fullstack.devs.modules.user.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private Long userId;
    private String username;
    private String email;
    private String avatarUrl;
    private boolean isActive;
    private long followersCount;
    private long followingCount;
    private LocalDateTime createdAt;
}
