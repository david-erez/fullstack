package com.fullstack.devs.modules.user.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.*;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest {
    @NotBlank(message = "username is nessesary")
    @Size(max = 50 , message = "the username is grand much")
    private String username;

    @NotBlank(message = "email is nessesary")
    @Email(message = "format the email is invalid")
    private String email;

    @NotBlank(message = "password is nessesary")
    @Size(max = 50 , message = "the password is grand much")
    private String password;

    private String avatarUrl;
}
