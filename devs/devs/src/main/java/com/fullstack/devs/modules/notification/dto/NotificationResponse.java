package com.fullstack.devs.modules.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NotificationResponse {

    private Long notificationId;
    private Long userId;           // quien recibe

    private Long actorId;          // quien genera
    private String actorUsername;    // para mostrar "tata te dio like"
    private String actorAvatarUrl;   // foto del actor

    private String type;             // like comment follow
    private Long referenceId;      // postId o commentId relacionado
    private boolean isRead;
    private LocalDateTime createdAt;
}