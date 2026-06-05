package com.fullstack.devs.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import lombok.*;

@Embeddable
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class UserFollowsId {
    @Column(name = "follower_id")
    private Long followerId;
    @Column(name = "following_id")
    private Long followingId;

}
