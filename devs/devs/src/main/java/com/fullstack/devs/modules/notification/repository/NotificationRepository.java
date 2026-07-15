package com.fullstack.devs.modules.notification.repository;

import com.fullstack.devs.modules.notification.entity.Notifications;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notifications, Long> {
    // todas las notificaciones de usuario  desde mas recientes
    List<Notifications>findByUserIdOrderByCreatedAtDesc(Long userId);

    // notificaciones no leidaw
    List<Notifications>findByUserUserIdAndIsRead(Long userId);

    // cuantas no estan leidas
    long countByUserUserIdAndIsReadFalse(Long userId );

}
