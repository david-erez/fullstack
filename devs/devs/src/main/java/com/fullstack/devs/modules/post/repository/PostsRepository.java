package com.fullstack.devs.modules.post.repository;

import com.fullstack.devs.modules.post.model.entity.Posts;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostsRepository extends JpaRepository<Posts,Long> {
    List<Posts> findByUsers_UserId(Long userId);

    List<Posts> findByIsVisibleTrueOrderByCreatedAtDesc();

    List<Posts> findByUsers_UserIdAndIsVisibleTrueOrderByCreatedAtDesc(Long userId);
}