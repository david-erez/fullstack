package com.fullstack.devs.modules.social.repository;

import com.fullstack.devs.modules.social.model.entity.Comments;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentsRepository extends JpaRepository<Comments,Long> {
    List<Comments> findByPosts_PostsId(Long postId);
    List<Comments> findByUsers_UserId(Long userId);
    long countByPosts_PostsId(Long postId);
    boolean existsByCommentsIdAndUsers_UserId(Long commentId, Long userId);
    Optional<Comments> findByCommentsIdAndUsers_UserId(Long commentId, Long userId);
}
