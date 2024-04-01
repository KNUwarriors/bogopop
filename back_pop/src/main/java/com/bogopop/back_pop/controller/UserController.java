package com.bogopop.back_pop.controller;

import com.bogopop.back_pop.domain.*;
import com.bogopop.back_pop.dto.UserDto;
import com.bogopop.back_pop.dto.TokenDto;
import com.bogopop.back_pop.service.LikeService;
import com.bogopop.back_pop.service.MovieService;
import com.bogopop.back_pop.service.ReviewService;
import com.bogopop.back_pop.service.UserService;
import com.bogopop.back_pop.jwt.TokenProvider;

import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Controller
public class UserController {
    private final UserService userService;
    private final LikeService likeService;
    private final ReviewService reviewService;
    private final MovieService movieService;

    private final TokenProvider tokenProvider;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;

    @GetMapping("/signup")
    public String createForm() {
        return "signup";
    }

    @PostMapping("/signup")
    @ApiOperation("회원가입")
    public String signup(UserDto userDto) {
        System.out.println(userDto);
        userService.join(userDto);
        return "users";
    }

    @GetMapping("/login")
    public String loginForm() {
        return "login";
    }

    @PostMapping("/login")
    public ResponseEntity<TokenDto> login(@RequestBody UserDto userDto) {
        try {
            // 사용자 로그인 처리
            User user = userService.login(userDto);

            // 로그인 성공한 경우 JWT 토큰 생성
            String jwt = tokenProvider.createToken(userDto); // userDto를 사용하여 토큰 생성

            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.add("Authorization", "Bearer " + jwt);

            return new ResponseEntity<>(new TokenDto(jwt), httpHeaders, HttpStatus.OK);
        } catch (Exception e) {
            // 로그인 실패 시 예외 처리
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }


    @GetMapping("/users")
    @ApiOperation("회원목록")
    public String allUsers(Model model) {
        List<User> users = userService.getAllUsers();
        model.addAttribute("users", users);
        return "users";
    }

    @GetMapping("/user")
    @ApiOperation("현재 로그인된 사용자 정보 조회")
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        // 현재 인증된 사용자의 정보를 가져오는 코드를 작성해야 합니다.
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName(); // 현재 로그인된 사용자의 이메일을 가져옴

        User user = userService.getUserByEmail(userEmail);
        if (user == null) {
            // 사용자를 찾을 수 없는 경우 404 에러를 반환합니다.
            return ResponseEntity.notFound().build();
        }

        List<MovieLike> likes = likeService.getAllMovieLikeByUserId(user.getId());
        List<Movie> movieLikes = new LinkedList<>();
        for (MovieLike like : likes){
            movieLikes.add(movieService.getMovieByMovieId(like.getMovieId()));
        }

        //내가 쓴 리뷰
        List<Review> myReviews = reviewService.getAllByUserId(user.getId());

        List<ReviewLike> likes2= likeService.getAllReviewLikeByUserId(user.getId());
        //내가 좋아요한 리뷰
        List<Review> likedReviews =new LinkedList<>();
        for (ReviewLike like: likes2){
            likedReviews.add(reviewService.getReviewByReviewId(like.getReviewId()));
        }

        Map<String, Object> userData = new HashMap<>();
        userData.put("user", user);
        userData.put("movieLikes", movieLikes);
        //내가 쓴 리뷰
        userData.put("myReviews", myReviews);
        //내가 좋아요 한 리뷰
        userData.put("likedReviews", likedReviews);

        return ResponseEntity.ok(userData);
    }

    @GetMapping("/users/ranking")
    @ApiOperation("유저 랭킹")
    @ResponseBody
    public List<UserDto> getUserRanking(){
        return userService.getUserRanking();
    }

//    @PostMapping("/updateProfile")
//    public String updateProfile(UserDto user) {
//        // 사용자 프로필 정보 업데이트 로직
//        userService.updateUserProfile(user); // 예시로 updateUserProfile 메서드를 사용하여 사용자 정보 업데이트
//        return "redirect:/profile";
//    }

}
