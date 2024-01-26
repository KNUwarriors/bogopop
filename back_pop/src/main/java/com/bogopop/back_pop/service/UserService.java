package com.bogopop.back_pop.service;

import com.bogopop.back_pop.domain.User;
import com.bogopop.back_pop.dto.UserDto;
import com.bogopop.back_pop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User join(UserDto userDto){
        // 같은 이름이 있는 중복 회원 X
//        validateDuplicateMember(user); // 중복 회원 검증

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
