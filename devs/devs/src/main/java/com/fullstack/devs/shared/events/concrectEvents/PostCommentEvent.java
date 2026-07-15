package com.fullstack.devs.shared.events.concrectEvents;

import com.fullstack.devs.shared.events.baseEvents.BaseNotificationEvent;

public class PostCommentEvent extends BaseNotificationEvent {
    public PostCommentEvent(Object source, Long userId, Long actorId, Long referenceID) {
        super(source, userId, actorId, referenceID);
    }
}
