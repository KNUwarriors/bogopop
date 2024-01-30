package com.bogopop.back_pop.service;

import com.bogopop.back_pop.domain.User;
import com.bogopop.back_pop.dto.UserDto;
import com.bogopop.back_pop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.security.auth.login.AccountException;
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
        if (userDto.getEmail() == null || userDto.getPassword() == null){
            System.out.println("null null");
            return null;}

        try {
            User user = userRepository.findByEmail(userDto.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userDto.getEmail()));

            if (!passwordEncoder.matches(userDto.getPassword(), user.getPassword())) {
                logger.warn("잘못된 비밀번호입니다. 사용자: {}", user.getEmail());
                throw new IllegalArgumentException("잘못된 비밀번호입니다.");
            }

            // 로그인이 성공하면 해당 사용자 정보를 반환
            logger.info("로그인 성공. 사용자: {}", user.getEmail());
            return user;
        } catch (Exception e) {
            // 예외 발생 시 로그 출력
            logger.error("로그인 중 에러 발생", e);
            throw e;
        }
    }



    public User join(UserDto userDto) {
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));
        return userRepository.save(
                User.builder()
                        .email(userDto.getEmail())
                        .password(userDto.getPassword())
                        .nickname(userDto.getNickname())
                        .profile(userDto.getProfile())
                        .background(userDto.getBackground())
                        .build()
        );
    }

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }
}
