package com.fullstack.devs.modules.user.service;

import com.fullstack.devs.modules.user.model.entity.Users;
import com.fullstack.devs.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class userService {
    @Autowired
    private final UserRepository userRepository;

/*    *//*-----obtener mi perfil------*//*
    public Users getMyProfile(){
        return
    }*/

    /*-----obtener el perfil de otro usuario------*/
    public Users getUserById(Long id){
        return userRepository.findById(id).orElseThrow(()-> new RuntimeException("User not found"));
    }
    /*-----actualizar mis datos------*/
/*    public Users updateMyPrefile(String newName, String newImage){

        if (newName != null && !newName.isBlank()){
            u
        }

    }*/
}
