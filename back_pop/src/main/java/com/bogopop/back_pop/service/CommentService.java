package com.bogopop.back_pop.service;

import com.bogopop.back_pop.domain.Comment;
import com.bogopop.back_pop.domain.Review;
import com.bogopop.back_pop.domain.User;
import com.bogopop.back_pop.dto.CommentDto;
import com.bogopop.back_pop.repository.CommentRepository;
import com.bogopop.back_pop.repository.ReviewLikeRepository;
import com.bogopop.back_pop.repository.ReviewRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final ReviewRepository reviewRepository;
    public List<Comment> getAllByReviewId(Long reviewId){
        return commentRepository.findAllByReviewId(reviewId);
    }

    public List<Comment> getAllByUserId(Long userId){
        return commentRepository.findAllByUserId(userId);
    }

    public Comment save(CommentDto commentDto, User user, Long reviewId) {
        if (commentDto.getContent() == null) {
            throw new IllegalArgumentException("Content of comment cannot be null");
        }

        // 영화 좋아요 수 증가
        Review review = reviewRepository.findById(reviewId).orElse(null);
        review.commentsChange(review.getComments() + 1);

        return commentRepository.save(
                Comment.builder()
                        .content(commentDto.getContent())
                        .reviewId(reviewId)
                        .userId(user.getId())
                        .build()
        );
    }

}
