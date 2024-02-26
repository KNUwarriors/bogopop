package com.bogopop.back_pop.repository;

import com.bogopop.back_pop.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    @Override
    Optional<Review> findById(Long aLong);

//    Optional<Review> findByUser_id(Long user_id);
//
//    Optional<Review> findByMovie_id(Long movie_id);

}
