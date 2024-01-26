package com.bogopop.back_pop.controller;

import com.bogopop.back_pop.domain.User;
import com.bogopop.back_pop.dto.UserDto;
import com.bogopop.back_pop.service.UserService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@RequiredArgsConstructor
@Controller
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/signup")
    public String createForm(){
        return "signup";
    }

    @PostMapping("/signup")
    @ApiOperation("회원가입")
    public String signup(UserDto userDto){
        userService.join(userDto);
        return "users";
    }

    @GetMapping("/users")
    @ApiOperation("회원가입")
    public String getAllUsers(Model model) {
        List<User> users = userService.getAllUsers();
        model.addAttribute("users", users);
        return "users";
    }
}
