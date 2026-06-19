package com.fullstack.devs.modules.post.repository;

import com.fullstack.devs.modules.post.model.entity.MediaFiles;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MediaFilesRepository extends JpaRepository<MediaFiles,Long> {
    /*todos los archivos de un post*/
    List<MediaFiles> findByPosts_PostsId(Long postId);
}
