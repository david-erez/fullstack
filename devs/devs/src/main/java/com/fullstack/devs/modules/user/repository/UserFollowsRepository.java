package com.fullstack.devs.modules.user.repository;

import com.fullstack.devs.modules.user.model.entity.UserFollows;
import com.fullstack.devs.modules.user.model.entity.UserFollowsId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserFollowsRepository extends JpaRepository<UserFollows, UserFollowsId> {
    /* Buscar los usuarios que sigue el follower. */
    List<UserFollows> findByFollower_UserId(Long followerId);

    /* Buscar los usuarios que siguen al following. */
    List<UserFollows> findByFollowing_UserId(Long followingId);

    /* Verificar si un usuario tiene seguidores. */
    boolean existsByFollowing_UserId(Long followingId);

    /* Verificar si follower ya sigue a following. */
    boolean existsByFollower_UserIdAndFollowing_UserId(    Long followerId, Long followingId);

    /* Contar seguidores de un usuario. */
    long countByFollowing_UserId(Long followingId);

    /* Contar usuarios seguidos por un usuario. */
    long countByFollower_UserId(Long followerId);
}
