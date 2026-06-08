package com.fullstack.devs.modules.post.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode

public class PostHashtagsId {
@Column(name = "posts_id")
private Long postsId;
@Column(name = "hashtags_id")
private Long hashtagsId;
}
