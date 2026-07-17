package com.fullstack.devs.modules.notification.entity;

import com.fullstack.devs.modules.user.model.entity.Users;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table (name = "notifications")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Notifications {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column (name = "notification_id")
    private Long notificationId;
    @Column (nullable = false, length = 30)
    private String type;
    @Column (name = "is_read")
    private boolean isRead;
    @Column (name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "reference_id")
    private Long referenceId;

    @ManyToOne
    @JoinColumn (name = "user_id",nullable = false)
    private Users users;
    @ManyToOne
    @JoinColumn (name = "actor_id",nullable = false)
    private Users actor;

    @PrePersist
    protected void onCreated(){
        createdAt = LocalDateTime.now();
    }
}
