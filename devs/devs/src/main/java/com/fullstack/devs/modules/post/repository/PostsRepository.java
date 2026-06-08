package com.fullstack.devs.modules.post.repository;

import com.fullstack.devs.modules.post.model.entity.Posts;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostsRepository extends JpaRepository<Posts,Long> {
    /*post ordenados por fecha*/
    List<Posts> findByIsVisibleTrueOrderByCreatedAtDesc();
    /*buscar por usuario especifico*/
    List<Posts> findByUserIdAndIsVisibleTrueOrderByCreatedAtDesc(Long userId);
}
