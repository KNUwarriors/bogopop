package com.bogopop.back_pop.service;

import com.bogopop.back_pop.domain.Review;
import com.bogopop.back_pop.domain.User;
import com.bogopop.back_pop.dto.ReviewDto;
import com.bogopop.back_pop.repository.ReviewRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;

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

        return reviewRepository.save(
                Review.builder()
                        .content(reviewDto.getContent())
                        .popScore(reviewDto.getPopScore())
                        .userId(user.getId())
                        .movieId(movieId)
                        .likes(0L)
                        .nickname(user.getNickname())
                        .popScore(0)
                        .profile(user.getProfile())
                        .build()
        );
    }
}
