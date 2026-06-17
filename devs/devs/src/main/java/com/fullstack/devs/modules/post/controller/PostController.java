package com.fullstack.devs.modules.post.controller;

import com.fullstack.devs.modules.post.mapper.PostMapper;
import com.fullstack.devs.modules.post.model.dto.PostRequest;
import com.fullstack.devs.modules.post.model.dto.PostResponse;
import com.fullstack.devs.modules.post.model.entity.Posts;
import com.fullstack.devs.modules.post.service.PostService;
import com.fullstack.devs.modules.user.model.entity.Users;
import com.fullstack.devs.modules.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor

public class PostController {
    private final PostService postService;
    private final UserService userService;
    private final PostMapper postMapper;


    @PostMapping("/post")
    public ResponseEntity<PostResponse>createPost(@RequestBody PostRequest request){
        PostResponse posts =  postService.createPost(request);
         return ResponseEntity.ok(posts);
    }
    @GetMapping("/getpost")
    public ResponseEntity<List<PostResponse>>getGlobalFeed(){
        List<PostResponse>feed = postService.getGlobalFeed();
        return ResponseEntity.ok(feed);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse>getPost(@PathVariable Long id) {
        Posts posts = postService.findById(id);
        return ResponseEntity.ok(postMapper.toResponse(posts));
    }
    @PutMapping("/{postId}")
    public ResponseEntity<PostResponse> updatePost(@PathVariable Long postId, @RequestBody PostRequest request) {
       Users user = userService.getAuthenticatedUser();
        PostResponse response = postService.updatePost(postId,user.getUserId(),request);
       return ResponseEntity.ok(response);

    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id) {
        Users user = userService.getAuthenticatedUser();
        postService.deletePost(id, user.getUserId());
        return ResponseEntity.ok("Post deleted successfully");
    }
}

