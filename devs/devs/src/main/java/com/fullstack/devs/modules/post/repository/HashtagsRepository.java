package com.fullstack.devs.modules.post.repository;

import com.fullstack.devs.modules.post.model.entity.Hashtags;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HashtagsRepository extends JpaRepository<Hashtags, Long> {

    /*buscar por nombre*/
    Optional<Hashtags> findByTag(String tag);

    /*verificar si existe*/
    boolean existsByTag(String tag);
}
