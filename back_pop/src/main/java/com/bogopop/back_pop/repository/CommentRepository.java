package com.bogopop.back_pop.repository;

import com.bogopop.back_pop.domain.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Override
    Optional<Comment> findById(Long aLong);

    List<Comment> findAllByReviewId(Long reviewId);

    List<Comment> findAllByUserId(Long userId);

    @Override
    List<Comment> findAll();
}
