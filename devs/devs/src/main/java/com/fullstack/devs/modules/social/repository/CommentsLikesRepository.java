package com.fullstack.devs.modules.social.repository;

import com.fullstack.devs.modules.social.model.entity.CommentsLikes;
import com.fullstack.devs.modules.social.model.entity.PostLikes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentsLikesRepository extends JpaRepository<PostLikes,Long> {
    boolean existsByCommentId_CommentsIdAndUserId_UserId(Long commentId, Long userId);

    Optional<CommentsLikes> findByCommentId_CommentsIdAndUserId_UserId(Long commentId, Long userId);

    List<CommentsLikes> findByCommentId_CommentsId(Long commentId);

    List<CommentsLikes> findByUserId_UserId(Long userId);

    long countByCommentId_CommentsId(Long commentId);

    void deleteByCommentId_CommentsIdAndUserId_UserId(Long commentId, Long userId);
}