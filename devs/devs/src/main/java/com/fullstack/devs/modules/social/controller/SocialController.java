package com.fullstack.devs.modules.social.controller;

import com.fullstack.devs.modules.social.model.dto.CommentRequest;
import com.fullstack.devs.modules.social.model.dto.CommentResponse;
import com.fullstack.devs.modules.social.model.dto.LikeResponse;
import com.fullstack.devs.modules.social.service.SocialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/social")
@RequiredArgsConstructor
public class SocialController {
    private final SocialService socialService;

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<CommentResponse>createdComment(@PathVariable Long postId, @RequestBody CommentRequest request){
        CommentResponse comment = socialService.createdComment(postId,request);
        return ResponseEntity.ok(comment);
    }

    @GetMapping("/getcomment/{id}")
    public ResponseEntity<CommentResponse>getComment(@PathVariable Long id){
        CommentResponse comment = socialService.getComment(id);
        return ResponseEntity.ok(comment);
    }

    @PutMapping("/{commentId}")
    public  ResponseEntity<CommentResponse>updateComment(@PathVariable Long commentId,@RequestBody CommentRequest request){
        CommentResponse comment = socialService.updateComment(commentId,request);
        return ResponseEntity.ok(comment);
    }

    @DeleteMapping("/{commentId}")
    public  ResponseEntity<String> deleteComment(@PathVariable Long commentId){
        socialService.deleteComment(commentId);
        return  ResponseEntity.ok("Comment deleted successfully");
    }

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<CommentResponse>>getCommentsByPost(@PathVariable Long postId){
        return ResponseEntity.ok(socialService.getCommentsByPost(postId));
    }

    @GetMapping("/posts/{postId}/likes")
    public ResponseEntity<List<LikeResponse>>getPostLikes(@PathVariable Long postId){
        return ResponseEntity.ok(socialService.getPostLikes(postId));
    }

    @GetMapping("/comments/{commentId}/likes")
    public ResponseEntity<List<LikeResponse>>getCommentLikes(@PathVariable Long commentId){
        return ResponseEntity.ok(socialService.getCommentLikes(commentId));
    }
}
