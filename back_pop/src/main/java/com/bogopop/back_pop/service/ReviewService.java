package com.bogopop.back_pop.service;

import com.bogopop.back_pop.domain.Movie;
import com.bogopop.back_pop.domain.Review;
import com.bogopop.back_pop.domain.User;
import com.bogopop.back_pop.dto.ReviewDto;
import com.bogopop.back_pop.repository.MovieRepository;
import com.bogopop.back_pop.repository.ReviewRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
@Slf4j
@Service
@AllArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final MovieService movieService;
    private final MovieRepository movieRepository;

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
        Movie movie = movieService.getMovieByMovieId(movieId);
        float reviewCount = movie.getReview_count();
        float newReviewCount = reviewCount + 1;
        float moviePopScore = movie.getPop_score() * reviewCount;
        float newReviewScore = reviewDto.getPopScore() + moviePopScore;
        movie.setReview_count(newReviewCount);
        log.info("movie reviewCount: " + movie.getReview_count());
        movie.setPop_score(newReviewScore/newReviewCount);
        log.info("movie popScore: " + movie.getPop_score());
        movieRepository.save(movie);

        return reviewRepository.save(
                Review.builder()
                        .content(reviewDto.getContent())
                        .popScore(reviewDto.getPopScore())
                        .userId(user.getId())
                        .movieId(movieId)
                        .likes(0L)
                        .nickname(user.getNickname())
                        .profile(user.getProfile())
                        .build()
        );
    }
}
