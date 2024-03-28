package com.bogopop.back_pop.repository;

import com.bogopop.back_pop.domain.ReviewLike;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface ReviewLikeRepository extends JpaRepository<ReviewLike, Long> {
    void deleteByUserIdAndReviewId(Long userId, Long movieId);
    Boolean existsByUserIdAndReviewId(Long userId, Long movieId);
    List<ReviewLike> findAllByUserId(Long userId);
}