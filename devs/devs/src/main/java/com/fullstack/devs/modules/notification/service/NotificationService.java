package com.fullstack.devs.modules.notification.service;

import com.fullstack.devs.modules.notification.dto.NotificationResponse;
import com.fullstack.devs.modules.notification.entity.Notifications;
import com.fullstack.devs.modules.notification.mapper.NotificationMapper;
import com.fullstack.devs.modules.notification.repository.NotificationRepository;
import com.fullstack.devs.modules.user.model.entity.Users;
import com.fullstack.devs.modules.user.repository.UserRepository;
import com.fullstack.devs.shared.serviec.BaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.management.Notification;
import java.util.List;


@Service
@RequiredArgsConstructor
public class NotificationService extends BaseService<Notifications, Long> {

    private final NotificationRepository notificationRepository;
    private  final UserRepository userRepository;
    private final NotificationMapper notificationMapper;
    @Override
    protected JpaRepository<Notifications, Long> getRepository() {
        return notificationRepository;
    }

    @Transactional
    public void create(Long userId, Long actorId, String type, Long referenceId){
        Users user = userRepository.findById(userId).orElseThrow(()-> new RuntimeException("User not found"));
        Users actor = userRepository.findById(actorId).orElseThrow(() -> new RuntimeException("Actor not found"));
        Notifications notifications = new Notifications();
        notifications.setUsers(user);
        notifications.setActor(actor);
        notifications.setType(type);
        notifications.setReferenceId(referenceId);
        notifications.setRead(false);

        notificationRepository.save(notifications);
    }

    //todas las notificaciones
    public List<NotificationResponse> getMyNotifications(String email){
        Users users = userRepository.findByEmail(email).orElseThrow(()-> new RuntimeException("User not fount"));

        return notificationRepository.findByUsersUserIdOrderByCreatedAtDesc(users.getUserId()).stream().map(notificationMapper :: toResponse).toList();

    }

    // notificaciones no leidas
    public  long countUnRead(String email){
        Users users = userRepository.findByEmail(email).orElseThrow(()-> new RuntimeException("User not fount"));
        return  notificationRepository.countByUsersUserIdAndIsReadFalse(users.getUserId());
    }

    // marcar como leida
    @Transactional
    public  void markAsRead(Long notificationId){
        Notifications notifications = findById(notificationId);
        notifications.setRead(true);
        notificationRepository.save(notifications);
    }

    // marcar todas como leidas
    @Transactional
    public  void  markAllRead(String email){
        Users users = userRepository.findByEmail(email).orElseThrow(()-> new RuntimeException("User not fount"));

        List<Notifications>unread =notificationRepository.findByUsersUserIdAndIsReadFalse(users.getUserId());

        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

}
