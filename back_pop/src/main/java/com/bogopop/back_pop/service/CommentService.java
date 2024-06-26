package com.bogopop.back_pop.service;

import com.bogopop.back_pop.domain.Comment;
import com.bogopop.back_pop.domain.Review;
import com.bogopop.back_pop.domain.User;
import com.bogopop.back_pop.dto.CommentDto;
import com.bogopop.back_pop.repository.CommentRepository;
import com.bogopop.back_pop.repository.ReviewRepository;
import com.bogopop.back_pop.repository.UserRepository;
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
    private final UserRepository userRepository;

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

        // 리뷰 답글 수 증가
        Review review = reviewRepository.findById(reviewId).orElse(null);
        review.setComments(review.getComments() + 1);

        // Comment 등록하면서 User의 Review Count에도 반영
        Long userReviewCount = user.getReviewCommentCount();
        user.setReviewCommentCount(userReviewCount + 1);
        userRepository.save(user);

        return commentRepository.save(
                Comment.builder()
                        .content(commentDto.getContent())
                        .reviewId(reviewId)
                        .userId(user.getId())
                        .nickname(user.getNickname())
                        .build()
        );
    }

    public void remove(Long commentId){
        Comment comment = commentRepository.findById(commentId).orElse(null);

        // 리뷰의 댓글 개수에도 반영
        Review review = reviewRepository.findById(comment.getReviewId()).orElse(null);
        log.info("comment count before deleting: " + review.getComments());
        review.setComments(review.getComments()-1);
        log.info("comment count after deleting: " + review.getComments());
        reviewRepository.save(review);

        // 유저의 리뷰+댓글 개수에도 반영
        User user = userRepository.findById(comment.getUserId()).orElse(null);
        log.info("count before deleting: " + user.getReviewCommentCount());
        user.setReviewCommentCount(user.getReviewCommentCount()-1);
        log.info("count after deleting: " + user.getReviewCommentCount());
        userRepository.save(user);

        // 최종적으로 댓글 삭제
        commentRepository.deleteById(commentId);
    }

}
