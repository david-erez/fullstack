package com.fullstack.devs.modules.social.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentRequest {
    @NotBlank(message = "Content is required")
    @Size(max = 666, message = "Comment cannot exceed 666 characteres")
    private String content;
}
