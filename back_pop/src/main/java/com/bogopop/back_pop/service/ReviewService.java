package com.bogopop.back_pop.service;

import com.bogopop.back_pop.domain.Comment;
import com.bogopop.back_pop.domain.Movie;
import com.bogopop.back_pop.domain.Review;
import com.bogopop.back_pop.domain.User;
import com.bogopop.back_pop.dto.ReviewDto;
import com.bogopop.back_pop.repository.CommentRepository;
import com.bogopop.back_pop.repository.MovieRepository;
import com.bogopop.back_pop.repository.ReviewRepository;
import com.bogopop.back_pop.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
@Slf4j
@Service
@AllArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final MovieRepository movieRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    public List<Review> getAllByUserId(Long userId){
        return reviewRepository.findAllByUserId(userId);
    }
    public List<Review> getAllByMovieId(Long movieId){
        return reviewRepository.findAllByMovieId(movieId);
    }

    public Review save(ReviewDto reviewDto, User user, Long movieId) {
        if (reviewDto.getContent() == null) {
            throw new IllegalArgumentException("Content of review cannot be null");
        }

        // Review 등록하면서 Movie의 Pop Score에도 반영
        Movie movie = movieRepository.findById(movieId).orElse(null);
        float movieReviewCount = movie.getReviewCount();
        float newReviewCount = movieReviewCount + 1;
        float moviePopScore = movie.getPopScore() * movieReviewCount;
        float newReviewScore = reviewDto.getPopScore() + moviePopScore;
        movie.setReviewCount(newReviewCount);
        log.info("movie movieReviewCount: " + movie.getReviewCount());
        movie.setPopScore(newReviewScore/newReviewCount);
        log.info("movie popScore: " + movie.getPopScore());
        movieRepository.save(movie);

        // Review 등록하면서 User의 Review Count에도 반영
        Long userReviewCount = user.getReviewCommentCount();
        user.setReviewCommentCount(userReviewCount + 1);
        userRepository.save(user);

        return reviewRepository.save(
                Review.builder()
                        .content(reviewDto.getContent())
                        .popScore(reviewDto.getPopScore())
                        .userId(user.getId())
                        .movieId(movieId)
                        .likes(0L)
                        .comments(0L)
                        .nickname(user.getNickname())
                        .profile(user.getProfile())
                        .build()
        );
    }

    public Review getReviewByReviewId(Long reviewId){
        return reviewRepository.findById(reviewId)
                .orElseThrow(() -> new UsernameNotFoundException("Review not found, reviewId: " + reviewId));
    }

    public void remove(Long reviewId){
        Review review = reviewRepository.findById(reviewId).orElse(null);

        // 영화에 반영
        Movie movie = movieRepository.findById(review.getMovieId()).orElse(null);
        float movieReviewCount = movie.getReviewCount();
        float newReviewCount = movieReviewCount - 1;
        float moviePopScore = movie.getPopScore() * movieReviewCount;
        float newReviewScore = moviePopScore - review.getPopScore();
        // 영화의 리뷰 개수에도 반영
        movie.setReviewCount(newReviewCount);
        // 영화의 평점에도 반영
        movie.setReviewCount(newReviewCount);
        log.info("movie movieReviewCount: " + movie.getReviewCount());
        movie.setPopScore(newReviewScore/newReviewCount);
        log.info("movie popScore: " + movie.getPopScore());
        movieRepository.save(movie);

        // 유저의 리뷰+댓글 개수에도 반영
        User userForReview = userRepository.findById(review.getUserId()).orElse(null);
        userForReview.setReviewCommentCount(userForReview.getReviewCommentCount()-1);
        userRepository.save(userForReview);

        // 리뷰에 댓글이 있다면
        // => 댓글을 단 유저의 리뷰 + 댓글 수 감소시키기
        if (review.getComments() > 0) {
            List<Comment> commentsList = commentRepository.findAllByReviewId(reviewId);

            for(Comment comment : commentsList){
                User userForComment = userRepository.findById(comment.getUserId()).orElse(null);
                userForComment.setReviewCommentCount(userForComment.getReviewCommentCount()-1);
                userRepository.save(userForComment);
            }
        }

        // 최종적으로 리뷰 삭제
        // => 외래키 참조를 통해 자동으로 댓글과 좋아요도 함께 삭제
        reviewRepository.deleteById(reviewId);
    }
}
