package com.bogopop.back_pop.controller;

import com.bogopop.back_pop.domain.Movie;
import com.bogopop.back_pop.domain.Review;
import com.bogopop.back_pop.domain.User;
import com.bogopop.back_pop.dto.ReviewDto;
import com.bogopop.back_pop.repository.ReviewRepository;
import com.bogopop.back_pop.service.ReviewService;
import com.bogopop.back_pop.service.UserService;
import io.swagger.annotations.ApiOperation;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@AllArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;
    private final UserService userService;
    private final ReviewRepository reviewRepository;

    @GetMapping("/reviews")
    @ApiOperation("영화별 리뷰 목록")
    @ResponseBody
    public List<Review> allReviewsByMovieId(@RequestParam Long movieId) {
//        List<Review> reviewList = reviewService.getAllByMovieId(movieId);
//        model.addAttribute("reviews", reviewList);
        return reviewService.getAllByMovieId(movieId);
    }

    @PostMapping("/reviews/write")
    public ResponseEntity<ReviewDto> writeReview(@RequestParam Long movieId, @RequestBody ReviewDto reviewDto, Authentication authentication) {
        String userEmail = authentication.getName(); // 현재 로그인된 사용자의 이메일을 가져옴

        User user = userService.getUserByEmail(userEmail);
        if (user == null) {
            // 사용자를 찾을 수 없는 경우 404 에러를 반환합니다.
            return ResponseEntity.notFound().build();
        }
        reviewService.save(reviewDto, user, movieId);

        //true or false
        return ResponseEntity.ok(reviewDto);
    }

    @GetMapping("/reviews/popularReviews")
    @ApiOperation("인기리뷰(좋아요 순) 10개 출력")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getPopularReviews() {
        List<Review> popularReviews = reviewRepository.findTop10ByOrderByLikesDescIdAsc();

        Map<String, Object> popularReviewData = new HashMap<>();
        popularReviewData.put("popularReviewes", popularReviews);
        return ResponseEntity.ok(popularReviewData);
    }
}
