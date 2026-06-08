package com.fullstack.devs.modules.post.model.dto;

import com.fullstack.devs.modules.post.model.entity.Hashtags;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostRequest {
    @NotBlank(message = "Content is nessesary")
    @Size(max = 280, message = "the content is grand much")
    private String content;
    private List<String> hashtags;

}