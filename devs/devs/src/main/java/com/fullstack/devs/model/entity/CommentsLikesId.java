package com.fullstack.devs.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class CommentsLikesId {
    @Column(name = "user_id")
    private Long userId;
    @Column(name = "comment_id")
    private Long commentId;
}
