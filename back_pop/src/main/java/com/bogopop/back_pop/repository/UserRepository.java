package com.bogopop.back_pop.repository;

import com.bogopop.back_pop.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    @Override
    Optional<User> findById(Long aLong);

    Optional<User> findByEmail(String email);

    Optional<User> findByNickname(String name);

    @Override
    List<User> findAll();
}
