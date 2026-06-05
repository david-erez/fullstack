package com.fullstack.devs.modules.user.model.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class UserFollowsId implements Serializable {
    @Column(name = "follower_id")
    private Long followerId;
    @Column(name = "following_id")
    private Long followingId;

}