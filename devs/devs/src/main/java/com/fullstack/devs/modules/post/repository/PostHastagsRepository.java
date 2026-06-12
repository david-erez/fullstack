package com.fullstack.devs.modules.post.repository;

import com.fullstack.devs.modules.post.model.entity.Hashtags;
import com.fullstack.devs.modules.post.model.entity.PostHashtags;
import com.fullstack.devs.modules.post.model.entity.PostHashtagsId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostHastagsRepository extends JpaRepository<PostHashtags, PostHashtagsId> {
    boolean existsById(PostHashtagsId id);

    // Persistencia heredada de JpaRepository
    // Busca todas las relaciones para un hashtag dado
    List<PostHashtags> findByHashtagsId(Hashtags hashtags);
}
