package com.fullstack.devs.shared.events.baseEvents;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;
@Getter
public class BaseNotificationEvent extends ApplicationEvent {
 private final Long userId; //quien hizo la accion

    private final Long actorId; // quien recivira la notificacion
    private final Long referenceID; // id del contenido multimenedia

    protected BaseNotificationEvent(Object source, Long userId, Long actorId, Long referenceID) {
        super(source);
        this.userId = userId;
        this.actorId = actorId;
        this.referenceID = referenceID;
    }

}
