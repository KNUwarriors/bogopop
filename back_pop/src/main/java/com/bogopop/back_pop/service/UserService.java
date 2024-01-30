package com.bogopop.back_pop.service;

import com.bogopop.back_pop.domain.User;
import com.bogopop.back_pop.dto.UserDto;
import com.bogopop.back_pop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;


    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User join(UserDto userDto) {
        userDto.setUserpw(passwordEncoder.encode(userDto.getUserpw()));
        return userRepository.save(
                User.builder()
                        .email(userDto.getEmail())
                        .password(userDto.getUserpw())
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
