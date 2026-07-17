package com.fullstack.devs.modules.notification.controller;

import com.fullstack.devs.modules.notification.dto.NotificationResponse;
import com.fullstack.devs.modules.notification.service.NotificationService;
import com.fullstack.devs.modules.user.model.entity.Users;
import com.fullstack.devs.modules.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final UserService userService;


    //todas las notificartions
    @GetMapping
    public ResponseEntity <List<NotificationResponse>> getMyNotifications(){
        Users user = userService.getAuthenticatedUser();
        return ResponseEntity.ok( notificationService.getMyNotifications(user.getName()));
    }

    // notifications no leidas
    @GetMapping("/count")
    public ResponseEntity <Map<String,Long>> countUnRead(){
        Users user = userService.getAuthenticatedUser();
        Long count = notificationService.countUnRead(user.getName());
        return ResponseEntity.ok(Map.of("unread",count));
    }

    //marcar notificacion como leidas
    @PutMapping("/{id}/read")
    public ResponseEntity<Void>  markAsRead(@PathVariable Long id){
        notificationService.markAsRead(id);
        return ResponseEntity.noContent().build();
    }

    //marcar todas como no leidas
    @PutMapping("/all")
    public ResponseEntity<Void>  markAsAllRead(){
        Users user = userService.getAuthenticatedUser();
        notificationService.markAllRead(user.getName());
        return ResponseEntity.noContent().build();
    }

    // eliminar una notificacion
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        notificationService.delete(id); // heredado de BaseService
        return ResponseEntity.noContent().build();
    }

}
