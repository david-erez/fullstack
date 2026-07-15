package com.fullstack.devs.shared.events.concrectEvents;

import com.fullstack.devs.shared.events.baseEvents.BaseNotificationEvent;

public class PostLikeEvent extends BaseNotificationEvent {
    public PostLikeEvent(Object source, Long userId, Long actorId, Long referenceID) {
        super(source, userId, actorId, referenceID);
    }
}
