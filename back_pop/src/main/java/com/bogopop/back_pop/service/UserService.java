package com.bogopop.back_pop.service;

import com.bogopop.back_pop.domain.User;
import com.bogopop.back_pop.dto.UserDto;
import com.bogopop.back_pop.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@Transactional
public class  UserService {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;


    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User login(UserDto userDto) {
        System.out.println("login method activated");

        try {
            User user = userRepository.findByEmail(userDto.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userDto.getEmail()));

            if (!passwordEncoder.matches(userDto.getPassword(), user.getPassword())) {
                throw new BadCredentialsException("wrong pw");
            }

            // 로그인이 성공하면 해당 사용자 정보를 반환
            log.info("log-in success. user: {}", user.getEmail());
            log.debug("log-in success. user: {}", userDto.getEmail());

            return user;
        } catch (UsernameNotFoundException e) {
            // 사용자를 찾을 수 없는 경우
            log.warn("login fail - 사용자를 찾을 수 없습니다. 이메일: {}", userDto.getEmail());
            throw e;
        } catch (BadCredentialsException e) {
            // 잘못된 비밀번호
            log.warn("로그인 실패 - 잘못된 비밀번호입니다. 이메일: {}", userDto.getEmail());
            throw e;
        } catch (Exception e) {
            // 기타 예외 처리
            log.error("로그인 중 에러 발생", e);
            throw e;
        }
    }

    public User join(UserDto userDto) {
        if (userDto.getPassword() == null) {
            throw new IllegalArgumentException("Password cannot be null");
        }
        if (userRepository.findOneWithAuthoritiesByEmail(userDto.getEmail()).orElse(null) != null) {
            throw new RuntimeException("이미 가입되어 있는 유저입니다.");
        }

        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
        return userRepository.save(
                User.builder()
                        .email(userDto.getEmail())
                        .password(userDto.getPassword())
                        .nickname(userDto.getNickname())
                        .profile("https://media.istockphoto.com/id/931419844/ko/%EB%B2%A1%ED%84%B0/%ED%9D%B0%EC%83%89-%EB%B0%B0%EA%B2%BD%EC%97%90%EC%84%9C-%EB%B2%A1%ED%84%B0-%ED%8C%9D%EC%BD%98-%EC%95%84%EC%9D%B4%EC%BD%98.jpg?s=612x612&w=0&k=20&c=cZG0AbZOd1_1Wzi_VbJUfTbsn743TPRqbFW4h8kQEus=")
                        .background("https://image.tmdb.org/t/p/original/h0oBqUpax591vOacpBsDJ8cynjk.jpg")
                        .role("ROLE_USER")
                        .reviewCommentCount(0L)
                        .build()
        );
    }


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

//    public List<User> getUserRanking(){
//
//        return userRepository.findByOrderByReviewCommentCountDesc();
//    }


    public List<UserDto> getUserRanking(){
        List<User> users = userRepository.findByOrderByReviewCommentCountDesc();
        List<UserDto> userDtos = new ArrayList<>();

        for (User user : users) {
            UserDto userDto = UserDto.builder()
                    .nickname(user.getNickname())
                    .profile(user.getProfile())
                    .background(user.getBackground())
                    .reviewCommentCount(user.getReviewCommentCount())
                    .build();
            userDtos.add(userDto);
        }

        return userDtos;
    }

}
