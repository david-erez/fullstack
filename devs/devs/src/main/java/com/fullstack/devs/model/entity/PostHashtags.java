package com.fullstack.devs.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
    @ManyToOne
    @JoinColumn (name = "post_id",nullable = false)
    private Posts postsId;
    @ManyToOne
    @JoinColumn (name = "hashtag_id",nullable = false)
    private Hashtags hashtagsId;

}
