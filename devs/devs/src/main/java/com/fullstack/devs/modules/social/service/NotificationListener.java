package com.fullstack.devs.modules.social.service;

import com.fullstack.devs.modules.notification.service.NotificationService;
import com.fullstack.devs.shared.events.concrectEvents.PostCommentEvent;
import com.fullstack.devs.shared.events.concrectEvents.PostLikeEvent;
import com.fullstack.devs.shared.events.concrectEvents.UserFollowEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class NotificationListener {
    private final NotificationService notificationService;

    //escucha un post like event
    @Async
    @EventListener
    public  void onPostLiked(PostLikeEvent event){
        notificationService.create(
                event.getUserId(),
                event.getActorId(),
                "like",
                event.getReferenceID()
        );
    }

    //escucha pun post
    @Async
    @EventListener
    public void onPostComment(PostCommentEvent event){
        notificationService.create(
                event.getUserId(),
                event.getActorId(),
                "comment",
                event.getReferenceID()
        );
    }
    //escucha un user followed event
    @Async
    @EventListener
    public void onUserFollowed(UserFollowEvent event){
        notificationService.create(
                event.getUserId(),
                event.getActorId(),
                "follow",
                event.getReferenceID()
        );
    }

}
