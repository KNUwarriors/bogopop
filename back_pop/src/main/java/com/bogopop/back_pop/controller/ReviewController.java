package com.bogopop.back_pop.controller;

import com.bogopop.back_pop.domain.Review;
import com.bogopop.back_pop.service.ReviewService;
import io.swagger.annotations.ApiOperation;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@AllArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @GetMapping("/reviews")
    @ApiOperation("영화별 리뷰 목록")
    public String allReviewsByMovieId(@RequestParam Long movieId, Model model) {
        List<Review> reviewList = reviewService.getAllByMovieId(movieId);
        model.addAttribute("reviews", reviewList);
        return "reviews";
    }
}
