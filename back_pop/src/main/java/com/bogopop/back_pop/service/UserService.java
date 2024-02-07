package com.bogopop.back_pop.service;

import com.bogopop.back_pop.domain.User;
import com.bogopop.back_pop.dto.UserDto;
import com.bogopop.back_pop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
@Transactional
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

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
                logger.warn("login fail - wrong pw. user: {}", user.getEmail());
                throw new BadCredentialsException("wrong pw");
            }

            // 로그인이 성공하면 해당 사용자 정보를 반환
            logger.info("log-in success. user: {}", user.getEmail());
            logger.debug("log-in success. user: {}", userDto.getEmail());

            return user;
        } catch (UsernameNotFoundException e) {
            // 사용자를 찾을 수 없는 경우
            logger.warn("login fail - 사용자를 찾을 수 없습니다. 이메일: {}", userDto.getEmail());
            throw e;
        } catch (BadCredentialsException e) {
            // 잘못된 비밀번호
            logger.warn("로그인 실패 - 잘못된 비밀번호입니다. 이메일: {}", userDto.getEmail());
            throw e;
        } catch (Exception e) {
            // 기타 예외 처리
            logger.error("로그인 중 에러 발생", e);
            throw e;
        }
    }

    public User join(UserDto userDto) {
        if (userRepository.findOneWithAuthoritiesByEmail(userDto.getEmail()).orElse(null) != null) {
            throw new RuntimeException("이미 가입되어 있는 유저입니다.");
        }

        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
        return userRepository.save(
                User.builder()
                        .email(userDto.getEmail())
                        .password(userDto.getPassword())
                        .nickname(userDto.getNickname())
                        .profile(userDto.getProfile())
                        .background(userDto.getBackground())
                        .role("ROLE_USER")
                        .build()
        );
    }


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
