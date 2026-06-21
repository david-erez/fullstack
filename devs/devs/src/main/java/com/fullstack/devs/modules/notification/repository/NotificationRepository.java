package com.fullstack.devs.modules.notification.repository;

import com.fullstack.devs.modules.notification.entity.Notifications;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notifications, Long> {
}
