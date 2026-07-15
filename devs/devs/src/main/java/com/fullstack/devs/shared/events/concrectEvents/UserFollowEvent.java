package com.fullstack.devs.shared.events.concrectEvents;

import com.fullstack.devs.shared.events.baseEvents.BaseNotificationEvent;

public class UserFollowEvent  extends BaseNotificationEvent {
    public UserFollowEvent(Object source, Long userId, Long actorId, Long referenceID) {
        super(source, userId, actorId, null);//e; follwo no tiene referencia
    }
}
