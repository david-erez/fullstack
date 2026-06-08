package com.fullstack.devs.modules.post.model.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table (name = "media_files")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MediaFiles {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column (name = "media_id")
    private Long mediaId;
    @Column (name = "url",nullable = false,length = 500)
    private String url;
    @Column (name = "media_type",nullable = false,length = 20)
    private  String meditaType;
    @Column (name = "created_at")
    private LocalDateTime createdAt;
    @ManyToOne
    @JoinColumn (name = "posts_id")
    private Posts posts;
    @PrePersist
    protected void onCrate(){
        createdAt = LocalDateTime.now();
    }


}
