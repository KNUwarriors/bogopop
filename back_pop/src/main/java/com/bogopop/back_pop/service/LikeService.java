package com.bogopop.back_pop.service;

import com.bogopop.back_pop.domain.*;
import com.bogopop.back_pop.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LikeService {
    private final MovieLikeRepository movieLikeRepository;
    private final UserRepository movieUserRepository;
    private final MovieRepository movieRepository;

    private final UserRepository reviewUserRepository;
    private final ReviewLikeRepository reviewLikeRepository;
    private final ReviewRepository reviewRepository;

    @Transactional
    public void addMovieLike(Long userId, Long movieId) {
        Movie movie = movieRepository.findById(movieId).orElse(null);
        User user = movieUserRepository.findById(userId).orElse(null);

        if (movie != null && user != null && !movieLikeRepository.existsByUserIdAndMovieId(userId, movieId)) {
            //System.out.println(userId);
            // 영화 좋아요 수 증가
            movie.likeChange(movie.getLikes() + 1);

            // 사용자와 영화 간의 좋아요 관계 추가
            movieLikeRepository.save(MovieLike.builder()
                    .userId(user.getId())
                    .movieId(movie.getId())
                    .build());
        }
    }



    @Transactional
    public void deleteMovieLike(Long userId, Long movieId) {
        Movie movie = movieRepository.findById(movieId).orElse(null);
        User user = movieUserRepository.findById(userId).orElse(null);

        if (movie != null && user != null && movieLikeRepository.existsByUserIdAndMovieId(userId, movieId)) {
            // 영화 좋아요 수 감소
            movie.likeChange(movie.getLikes() - 1);

            // 사용자와 영화 간의 좋아요 관계 삭제
            movieLikeRepository.deleteByUserIdAndMovieId(userId, movieId);
        }
    }


    public Boolean checkMovieLike(Long userId, Long movieId) {
        return movieLikeRepository.existsByUserIdAndMovieId(userId, movieId);
    }


    @Transactional
    public void addReviewLike(Long userId, Long reviewId) {
        Review review = reviewRepository.findById(reviewId).orElse(null);
        User user = reviewUserRepository.findById(userId).orElse(null);

        if (review != null && user != null && !reviewLikeRepository.existsByUserIdAndReviewId(userId, reviewId)) {
            //System.out.println(userId);
            // 영화 좋아요 수 증가
            review.likeChange(review.getLikes() + 1);

            // 사용자와 영화 간의 좋아요 관계 추가
            reviewLikeRepository.save(ReviewLike.builder()
                    .userId(user.getId())
                    .reviewId(review.getId())
                    .build());
        }
    }



    @Transactional
    public void deleteReviewLike(Long userId, Long reviewId) {
        Review review = reviewRepository.findById(reviewId).orElse(null);
        User user = reviewUserRepository.findById(userId).orElse(null);

        if (review != null && user != null && reviewLikeRepository.existsByUserIdAndReviewId(userId, reviewId)) {
            // 영화 좋아요 수 감소
            review.likeChange(review.getLikes() - 1);

            // 사용자와 영화 간의 좋아요 관계 삭제
            reviewLikeRepository.deleteByUserIdAndReviewId(userId, reviewId);
        }
    }


    public Boolean checkReviewLike(Long userId, Long reviewId) {
        return reviewLikeRepository.existsByUserIdAndReviewId(userId, reviewId);
    }

    public List<MovieLike> getAllMovieLikeByUserId(Long userId){
        return movieLikeRepository.findAllByUserId(userId);
    }

}
