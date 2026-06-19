package com.fullstack.devs.modules.social.mapper;

import com.fullstack.devs.modules.social.model.dto.CommentRequest;
import com.fullstack.devs.modules.social.model.dto.CommentResponse;
import com.fullstack.devs.modules.social.model.dto.LikeResponse;
import com.fullstack.devs.modules.social.model.entity.Comments;
import com.fullstack.devs.modules.social.model.entity.CommentsLikes;
import com.fullstack.devs.modules.social.model.entity.PostLikes;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SocialMapper {

    @Mapping(target = "commentsId", ignore = true)
    @Mapping(target = "created_at", ignore = true)
    @Mapping(target = "posts", ignore = true)
    @Mapping(target = "users", ignore = true)
    Comments toEntity(CommentRequest dto);

    @Mapping(source = "comment.commentsId", target = "commentId")
    @Mapping(source = "comment.posts.postsId", target = "postId")
    @Mapping(source = "comment.users.userId", target = "userId")
    @Mapping(source = "comment.users.name", target = "name")
    @Mapping(source = "comment.users.imagePath", target = "avatarUrl")
    @Mapping(source = "comment.content", target = "content")
    @Mapping(source = "comment.created_at", target = "createdAt")
    @Mapping(source = "likesCount", target = "likesCount")
    CommentResponse toResponse(Comments comment, int likesCount);

    @Mapping(source = "users.userId", target = "userId")
    @Mapping(source = "users.name", target = "name")
    @Mapping(source = "users.imagePath", target = "avatarUrl")
    @Mapping(source = "posts.postsId", target = "targetId")
    @Mapping(source = "created_At", target = "createdAt")
    @Mapping(target = "targetType", constant = "POST")
    LikeResponse postLikeToResponse(PostLikes like);

    @Mapping(source = "userId.userId", target = "userId")
    @Mapping(source = "userId.name", target = "name")
    @Mapping(source = "userId.imagePath", target = "avatarUrl")
    @Mapping(source = "commentId.commentsId", target = "targetId")
    @Mapping(source = "createdAt", target = "createdAt")
    @Mapping(target = "targetType", constant = "COMMENT")
    LikeResponse commentsLikeToResponse(CommentsLikes like);
}
