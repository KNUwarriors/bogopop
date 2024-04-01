package com.bogopop.back_pop.repository;

import com.bogopop.back_pop.domain.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {


    @Override
    Optional<User> findById(Long aLong);

    Optional<User> findByEmail(String email);

    @EntityGraph(attributePaths = "role")
        //lazy아니고 eager 조회, 유저네임으로 가져올 때 authorities 정보도 같이 가져옴
    Optional<User> findOneWithAuthoritiesByEmail(String email);


    @Override
    List<User> findAll();

    List<User> findByOrderByReviewCommentCountDesc();

}
