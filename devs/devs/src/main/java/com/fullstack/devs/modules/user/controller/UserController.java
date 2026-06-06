package com.fullstack.devs.modules.user.controller;

import com.fullstack.devs.modules.user.mapper.UserMapper;
import com.fullstack.devs.modules.user.model.dto.UserResponse;
import com.fullstack.devs.modules.user.model.entity.Users;
import com.fullstack.devs.modules.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserMapper userMapper;


    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMyProfile(){
        Users users =userService.getMyProfile();
        return ResponseEntity.ok(userMapper.toResponse(users));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById (@PathVariable Long id){
        Users users = userService.getUserById(id);
        return ResponseEntity.ok(userMapper.toResponse(users));
    }

    @GetMapping("/search/{name}")
    public ResponseEntity<UserResponse> getName (@PathVariable String name){
        Users users = userService.getName(name);
        return ResponseEntity.ok(userMapper.toResponse(users));
    }

    @PutMapping("/me")
    public  ResponseEntity<UserResponse> updateMyPrefile(@RequestBody Map<String,String> body){
        Users users = userService.updateMyPrefile(
                body.get("name"),
                body.get("newImage")
        );
        return ResponseEntity.ok(userMapper.toResponse(users));
    }

    @PutMapping("/me/password")
    public  ResponseEntity<String> changePassword(@RequestBody Map<String,String> body){
         userService.changePassword(
                body.get("currentPassword"),
                body.get("newPassword")
        );
        return  ResponseEntity.ok("password change nice very god");

    }

    @DeleteMapping("/me")
    public ResponseEntity<String> deleteCount(){
        userService.deleteCount();
        return ResponseEntity.ok("count delete");
    }

    @PutMapping("/me/follow")
    public ResponseEntity<String> follow(@RequestBody Map<String, Long> body){
        userService.follow(
                body.get("followingId")
        );
        return ResponseEntity.ok("follow success");
    }

    @DeleteMapping ("/me/unFollow")
    public ResponseEntity<String> unFollow(@RequestBody Map<String, Long> body){
        userService.unFollow(
                body.get("followingId")
        );
        return  ResponseEntity.ok("un follow is corret");
    }

    @GetMapping("/followers/{id}")
    public ResponseEntity<List<UserResponse>>  countFollows (@PathVariable long id){
        List<UserResponse> response = userService.countFollows(id)
                .stream()
                .map(userMapper::toResponse)
                .toList();
        return ResponseEntity.ok(response);
    }
    @GetMapping ("/me/countfal/{id}")
    public ResponseEntity<List<UserResponse>>  cuntFollowings (@PathVariable long id){
        List<UserResponse> responses = userService.cuntFollowings(id)
                .stream()
                .map(userMapper::toResponse)
                .toList();
        return ResponseEntity.ok(responses);
    }



}
