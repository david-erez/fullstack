package com.fullstack.devs.modules.user.mapper;

import com.fullstack.devs.modules.user.model.dto.UserRequest;
import com.fullstack.devs.modules.user.model.dto.UserResponse;
import com.fullstack.devs.modules.user.model.entity.Users;
import org.mapstruct.Mapper;
import org.springframework.security.core.userdetails.User;

@Mapper
public interface UserMapper {
    public Users toEntity (UserRequest dto);
    public UserResponse toResponse (User user);
}
