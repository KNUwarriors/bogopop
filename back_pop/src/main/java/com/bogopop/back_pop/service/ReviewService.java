package com.bogopop.back_pop.service;

import com.bogopop.back_pop.domain.Review;
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
}
