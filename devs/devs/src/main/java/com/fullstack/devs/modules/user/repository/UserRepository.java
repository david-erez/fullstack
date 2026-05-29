package com.fullstack.devs.modules.user.repository;

import com.fullstack.devs.modules.user.model.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<Users,Long> {
    /* ***Encontrar el email*** */
   Optional<Users> findByEmail(String email);
    /* ***Verificar que el email no se repita *** */
   boolean existsByEmail (String email);


}
