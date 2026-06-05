package com.fullstack.devs.modules.user.service;

import com.fullstack.devs.modules.user.model.entity.UserFollows;
import com.fullstack.devs.modules.user.model.entity.UserFollowsId;
import com.fullstack.devs.modules.user.model.entity.Users;
import com.fullstack.devs.modules.user.repository.UserFollowsRepository;
import com.fullstack.devs.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    @Autowired
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserFollowsRepository userFollowsRepository;
    /*metodo para persistencia de usuario*/
    public Users getAuthenticatedUser(){
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        return userRepository.findByEmail(email).orElseThrow(()-> new RuntimeException("User not fount"));
    }

    /*-----obtener mi perfil------*/
    public Users getMyProfile(){
        return getAuthenticatedUser();
    }

    /*-----obtener el perfil de otro usuario------*/
    public Users getUserById(Long id){
        return userRepository.findById(id).orElseThrow(()-> new RuntimeException("User not found"));
    }
    public Users getUserEmail(String username){
        return  userRepository.findByUsername(username).orElseThrow(()-> new RuntimeException("User no found"+ username));
    }
    /*-----actualizar mis datos------*/
    public Users updateMyPrefile(String newName, String newImage){
        Users users =  getAuthenticatedUser();
        if (newName != null && !newName.isBlank()){
            users   .setName(newName);
        }
        if (newImage != null && !newName.isBlank()){
            users.setImagePath(newImage);
        }
        return userRepository.save(users);
    }
    /*cambiar contrasena*/
    public void changePassword(String currentPassword,String newPassword){
        Users users =getAuthenticatedUser();
        if (!passwordEncoder.matches(currentPassword, users.getPasswordHash())){
            throw new RuntimeException("the password current is incorrect");
        }
        users.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(users);
    }

    public void deleteCount(){
        Users users = getAuthenticatedUser();
        userRepository.delete(users);
    }

    /*segir*/

    /*wedewfqqqrrrrrrrrrrrrrrrrrrrrrrr*/
    /*seguir usuario*/
    public void follow(Long followerId, Long followingId){
        if (followerId.equals(followingId)){
            throw new RuntimeException("not follow you my men xd");
        }
        if (userFollowsRepository.existsByFollower_UserIdAndFollowing_UserId(followerId, followingId)){
            throw  new RuntimeException("not folloig to un user a folowign no se puede seguir a quien ya se sigue");
        }
        Users follower = getUserById(followerId);
        Users following = getUserById(followingId);

        UserFollows userFollows =new UserFollows();
        userFollows.setId(new UserFollowsId(followerId, followingId));
        userFollows.setFollower(follower);
        userFollows.setFollowing(following);
        userFollowsRepository.save(userFollows);
    }

    /*ya no seguir usuario*/
    public void unFollow (Long followerId, Long followingId){
        UserFollowsId userFollowsId = new UserFollowsId(followerId,followingId);
        if (!userFollowsRepository.existsById(userFollowsId)){
            throw  new RuntimeException("not following user");
        }
        userFollowsRepository.deleteById(userFollowsId);
    }
    /*lista de seguidores:*/
    public List<Users> countFollows(Long userId){
        return userFollowsRepository.findByFollowing_UserId(userId).stream()
                .map(UserFollows::getFollower)
                .toList();
    }
    /*lista de seguidos*/
    public  List<Users> cuntFollowings(Long userId){
        return  userFollowsRepository.findByFollower_UserId(userId).stream()
                .map(UserFollows::getFollowing)
                .toList();
    }
}
