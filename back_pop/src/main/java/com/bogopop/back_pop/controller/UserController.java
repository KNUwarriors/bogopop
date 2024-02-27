package com.bogopop.back_pop.controller;

import com.bogopop.back_pop.domain.User;
import com.bogopop.back_pop.dto.UserDto;
import com.bogopop.back_pop.dto.TokenDto;
import com.bogopop.back_pop.service.UserService;
import com.bogopop.back_pop.jwt.TokenProvider;

import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@Controller
public class UserController {
    @Autowired
    private UserService userService;

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
    public ResponseEntity<User> getCurrentUser() {
        // 현재 인증된 사용자의 정보를 가져오는 코드를 작성해야 합니다.
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName(); // 현재 로그인된 사용자의 이메일을 가져옴

        User user = userService.getUserByEmail(userEmail);
        if (user == null) {
            // 사용자를 찾을 수 없는 경우 404 에러를 반환합니다.
            return ResponseEntity.notFound().build();
        }
    // User 객체를 UserDto 객체로 변환하여 반환합니다.
        UserDto userDto = UserDto.builder()
                .email(user.getEmail())
                .password(user.getPassword())
                .nickname(user.getNickname())
                .profile(user.getProfile())
                .background(user.getBackground())
                .role(user.getRole())
                .liked_movies(user.getLiked_movies())
                .liked_lists(user.getLiked_lists())
                .my_lists(user.getMy_lists())
                .my_reviews(user.getMy_reviews())
                .build();
        return ResponseEntity.ok(user);
    }


}
