package com.fullstack.devs.modules.post.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "post_hashtags")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostHashtags {
    @EmbeddedId
    private PostHashtagsId id;

    @ManyToOne
    @MapsId("postsId")
    @JoinColumn (name = "post_id",nullable = false)
    private Posts postsId;
    @ManyToOne
    @MapsId("hashtagsId")
    @JoinColumn (name = "hashtag_id",nullable = false)
    private Hashtags hashtagsId;

}
