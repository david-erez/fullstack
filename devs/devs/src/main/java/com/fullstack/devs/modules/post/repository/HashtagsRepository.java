package com.fullstack.devs.modules.post.repository;

import com.fullstack.devs.modules.post.model.entity.Hashtags;
import com.fullstack.devs.modules.post.model.entity.PostHashtagsId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HashtagsRepository extends JpaRepository<Hashtags, PostHashtagsId> {
    /*todos los hashtags de un post*/
    List<Hashtags> findByContents_ContentId(Long PostHashtagsId);
    /*buscar por nombre*/
    Optional<Hashtags> findByTag(String tag);
    /*verificar si existe*/
    boolean existisByTag(String tag);
}
