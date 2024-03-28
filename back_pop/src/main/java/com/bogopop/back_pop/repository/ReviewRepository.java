package com.bogopop.back_pop.repository;

import com.bogopop.back_pop.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    @Override
    Optional<Review> findById(Long aLong);

    List<Review> findAllByUserId(Long user_id);

    List<Review> findAllByMovieId(Long movie_id);

    @Override
    List<Review> findAll();

    List<Review> findTop5ByOrderByLikesDescIdAsc();

    @Override
    void deleteById(Long aLong);
}
