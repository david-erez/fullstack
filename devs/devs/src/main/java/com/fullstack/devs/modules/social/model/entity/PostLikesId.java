package com.fullstack.devs.modules.social.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class PostLikesId {
    @Column(name = "post_id")
    private  Long postId;
    @Column(name = "user_id")
    private  Long userId;
}
