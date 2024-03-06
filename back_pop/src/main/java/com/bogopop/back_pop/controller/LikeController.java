package com.bogopop.back_pop.controller;

import com.bogopop.back_pop.domain.User;
import com.bogopop.back_pop.service.LikeService;
import com.bogopop.back_pop.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
public class LikeController {
    private final LikeService likeService;
    private final UserService userService;

    @Autowired
    public LikeController(LikeService likeService, UserService userService) {
        this.likeService = likeService;
        this.userService = userService;
    }


    @PostMapping("/movies/addLike")
    @ResponseBody
    public ResponseEntity<Object> addMovieLike(@RequestParam Long movieId, Authentication authentication) {
        //Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName(); // 현재 로그인된 사용자의 이메일을 가져옴

        User user = userService.getUserByEmail(userEmail);
        if (user == null) {
            // 사용자를 찾을 수 없는 경우 404 에러를 반환합니다.
            return ResponseEntity.notFound().build();
        }

        likeService.addMovieLike(user.getId(), movieId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/movies/deleteLike")
    @ResponseBody
    public ResponseEntity<Object> deleteMovieLike(@RequestParam Long movieId, Authentication authentication) {

        //Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName(); // 현재 로그인된 사용자의 이메일을 가져옴

        User user = userService.getUserByEmail(userEmail);
        if (user == null) {
            // 사용자를 찾을 수 없는 경우 404 에러를 반환합니다.
            return ResponseEntity.notFound().build();
        }

        likeService.deleteMovieLike(user.getId(), movieId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/movies/checkLike")
    public ResponseEntity<Boolean> checkMovieLike(@RequestParam Long movieId, Authentication authentication) {

        String userEmail = authentication.getName(); // 현재 로그인된 사용자의 이메일을 가져옴

        User user = userService.getUserByEmail(userEmail);
        if (user == null) {
            // 사용자를 찾을 수 없는 경우 404 에러를 반환합니다.
            return ResponseEntity.notFound().build();
        }


        boolean isLiked = likeService.checkMovieLike(user.getId(), movieId);
        return ResponseEntity.ok(isLiked);
    }

    @PostMapping("/reviews/addLike")
    @ResponseBody
    public ResponseEntity<Object> addReviewLike(@RequestParam Long reviewId, Authentication authentication) {
        //Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName(); // 현재 로그인된 사용자의 이메일을 가져옴

        User user = userService.getUserByEmail(userEmail);
        if (user == null) {
            // 사용자를 찾을 수 없는 경우 404 에러를 반환합니다.
            return ResponseEntity.notFound().build();
        }

        likeService.addReviewLike(user.getId(), reviewId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/reviews/deleteLike")
    @ResponseBody
    public ResponseEntity<Object> deleteReviewLike(@RequestParam Long reviewId, Authentication authentication) {

        //Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName(); // 현재 로그인된 사용자의 이메일을 가져옴

        User user = userService.getUserByEmail(userEmail);
        if (user == null) {
            // 사용자를 찾을 수 없는 경우 404 에러를 반환합니다.
            return ResponseEntity.notFound().build();
        }

        likeService.deleteReviewLike(user.getId(), reviewId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/reviews/checkLike")
    public ResponseEntity<Boolean> checkReviewLike(@RequestParam Long reviewId, Authentication authentication) {

        String userEmail = authentication.getName(); // 현재 로그인된 사용자의 이메일을 가져옴

        User user = userService.getUserByEmail(userEmail);
        if (user == null) {
            // 사용자를 찾을 수 없는 경우 404 에러를 반환합니다.
            return ResponseEntity.notFound().build();
        }


        boolean isLiked = likeService.checkReviewLike(user.getId(), reviewId);
        return ResponseEntity.ok(isLiked);
    }
}


