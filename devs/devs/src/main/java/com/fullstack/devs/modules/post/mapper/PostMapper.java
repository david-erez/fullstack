package com.fullstack.devs.modules.post.mapper;

import com.fullstack.devs.modules.post.model.dto.PostResponse;
import com.fullstack.devs.modules.post.model.entity.Posts;
import com.fullstack.devs.modules.user.model.dto.UserRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PostMapper {

    public Posts toEntity(UserRequest dto);
    public PostResponse toResponse(Posts posts);
}
