package com.bogopop.back_pop.controller;

import com.bogopop.back_pop.domain.*;
import com.bogopop.back_pop.repository.ProfileImgRepository;
import com.bogopop.back_pop.service.ProfileImgService;
import com.bogopop.back_pop.service.UserService;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RequiredArgsConstructor
@Controller
public class ProfileController {

    private final UserService userService;
    private final ProfileImgService profileImgService;

    @GetMapping("/profiles")
    @ApiOperation("프로필 이미지 목록")
    @ResponseBody
    public List<String> allProfileImgs() {
        // 모든 프로필 파일의 파일명 목록
        List<ProfileImg> profileImgs = profileImgService.getAllProfileImg();

        // 프로필 파일의 파일명만 추출하여 리스트로 변환
        List<String> profileImgNames = profileImgs.stream()
                .map(ProfileImg::getFileName)
                .collect(Collectors.toList());
        return profileImgNames;
    }

    @PostMapping("/profiles/updateProfile")
    @ApiOperation("프로필 사진 설정")
    public ResponseEntity<Void> updateUserProfile(@RequestParam("imageName") String imageName) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName(); // 현재 로그인된 사용자의 이메일을 가져옴

        User user = userService.getUserByEmail(userEmail);
        if (user == null) {
            // 사용자를 찾을 수 없는 경우 404 에러를 반환
            return ResponseEntity.notFound().build();
        }

        // 사용자 프로필 정보 업데이트 로직
        userService.updateUserProfile(user.getId(), imageName);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/profiles/backdropMovies")
    @ApiOperation("프로필 배경화면용 영화 목록")
    @ResponseBody
    public List<Map<String, String>> getBackdropImgs() {
        // 모든 프로필 파일의 파일명 목록
        List<Map<String, String>> backdropMovies = profileImgService.getBackdrops();
        return backdropMovies;
    }

    @PostMapping("/profiles/updateBackground")
    @ApiOperation("프로필 배경사진 변경")
    public ResponseEntity<Void> updateUserBackground(@RequestBody Map<String, String> requestData) {
        String backdropPath = requestData.get("backdropPath");

      
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName(); // 현재 로그인된 사용자의 이메일을 가져옴

        User user = userService.getUserByEmail(userEmail);
        if (user == null) {
            // 사용자를 찾을 수 없는 경우 404 에러를 반환
            return ResponseEntity.notFound().build();
        }

        // 사용자 프로필 정보 업데이트 로직
        userService.updateUserBackground(user.getId(), backdropPath);
        return ResponseEntity.ok().build();
    }

}
