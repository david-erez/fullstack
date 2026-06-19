package com.fullstack.devs.modules.social.repository;

import com.fullstack.devs.modules.social.model.entity.PostLikes;
import com.fullstack.devs.modules.social.model.entity.PostLikesId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PostLikesRepository extends JpaRepository<PostLikes, PostLikesId> {

    boolean existsByPosts_PostsIdAndUsers_UserId(Long postId, Long userId);

    Optional<PostLikes> findByPosts_PostsIdAndUsers_UserId(Long postId, Long userId);

    List<PostLikes> findByPosts_PostsId(Long postId);

    List<PostLikes> findByUsers_UserId(Long userId);

    long countByPosts_PostsId(Long postId);

    void deleteByPosts_PostsIdAndUsers_UserId(Long postId, Long userId);
}