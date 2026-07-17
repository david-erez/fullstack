package com.fullstack.devs.modules.notification.mapper;

import com.fullstack.devs.modules.notification.dto.NotificationResponse;
import com.fullstack.devs.modules.notification.entity.Notifications;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    @Mapping(source = "users.userId", target = "userId")
    @Mapping(source = "actor.userId", target = "actorId")
    @Mapping(source = "actor.name", target = "actorUsername")
    @Mapping(source = "actor.imagePath", target = "actorAvatarUrl")
    NotificationResponse toResponse(Notifications notification);
}