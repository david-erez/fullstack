package com.fullstack.devs.modules.security.repository;

import com.fullstack.devs.modules.security.model.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenRepository extends JpaRepository<Token,Long> {
}
