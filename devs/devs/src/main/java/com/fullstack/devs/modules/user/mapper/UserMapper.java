package com.fullstack.devs.modules.user.mapper;

import com.fullstack.devs.modules.user.model.dto.UserRequest;
import com.fullstack.devs.modules.user.model.dto.UserResponse;
import com.fullstack.devs.modules.user.model.entity.Users;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    
    @Mapping(source = "username", target = "name")
    @Mapping(source = "avatarUrl", target = "imagePath")
    @Mapping(target = "passwordHash", ignore = true)
    public Users toEntity (UserRequest dto);
    public UserResponse toResponse (Users user);
}
