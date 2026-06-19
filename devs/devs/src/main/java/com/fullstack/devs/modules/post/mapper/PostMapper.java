package com.fullstack.devs.modules.post.mapper;

import com.fullstack.devs.modules.post.model.dto.PostRequest;
import com.fullstack.devs.modules.post.model.dto.PostResponse;
import com.fullstack.devs.modules.post.model.entity.Posts;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PostMapper {


    @Mapping(target = "users", ignore = true)
    public Posts toEntity(PostRequest dto);

    @Mapping(source = "users.userId", target = "userId")
    @Mapping(source = "users.name", target = "name")
    @Mapping(source = "postsId", target = "postId")
    @Mapping(source = "updateAt", target = "updatedAt")
    @Mapping(target = "likes", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "hashtags", ignore = true)
    public PostResponse toResponse(Posts posts);
}
