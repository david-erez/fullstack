package com.fullstack.devs.modules.post.mapper;

import com.fullstack.devs.modules.post.model.dto.PostRequest;
import com.fullstack.devs.modules.post.model.dto.PostResponse;
import com.fullstack.devs.modules.post.model.entity.Posts;
import com.fullstack.devs.modules.user.model.dto.UserRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PostMapper {


    @Mapping( target = "user" , ignore = true)
    @Mapping( target = "postHashtags" , ignore = true)
    @Mapping( target = "mediaFiles" , ignore = true)
    public Posts toEntity(PostRequest dto);
    @Mapping(source = "user.userId",   target = "userId")
    @Mapping(source = "user.username", target = "username")
    @Mapping(source = "postId",        target = "postId")
    public PostResponse toResponse(Posts posts);
}
