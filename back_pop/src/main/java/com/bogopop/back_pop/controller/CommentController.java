package com.bogopop.back_pop.controller;

import com.bogopop.back_pop.domain.Comment;
import com.bogopop.back_pop.domain.User;
import com.bogopop.back_pop.dto.CommentDto;
import com.bogopop.back_pop.service.CommentService;
import com.bogopop.back_pop.service.UserService;
import io.swagger.annotations.ApiOperation;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@AllArgsConstructor
public class CommentController {
    public final CommentService commentService;
    public final UserService userService;

/*    @GetMapping("/reviews/{reviewId}/comments")
    @ApiOperation("리뷰별 댓글 목록")
    @ResponseBody
    public List<Comment> allCommentsByReviewId(@PathVariable("reviewId") Long reviewId) {
        return commentService.getAllByReviewId(reviewId);
    }

    @PostMapping("/reviews/{reviewId}/comments")
    public ResponseEntity<CommentDto> writeComment(@PathVariable("reviewId") Long reviewId, @RequestBody CommentDto commentDto, Authentication authentication) {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName(); // 현재 로그인된 사용자의 이메일을 가져옴

        User user = userService.getUserByEmail(userEmail);
        if (user == null) {
            // 사용자를 찾을 수 없는 경우 404 에러를 반환합니다.
            return ResponseEntity.notFound().build();
        }
        commentService.save(commentDto, user, reviewId);

        return ResponseEntity.ok(commentDto);
    }*/

    @GetMapping("/comments")
    @ApiOperation("리뷰별 댓글 목록")
    @ResponseBody
    public List<Comment> allCommentsByReviewId(@RequestParam Long reviewId) {
        return commentService.getAllByReviewId(reviewId);
    }

    @PostMapping("/comments/write")
    public ResponseEntity<CommentDto> writeComment(@RequestParam Long reviewId, @RequestBody CommentDto commentDto, Authentication authentication) {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName(); // 현재 로그인된 사용자의 이메일을 가져옴

        User user = userService.getUserByEmail(userEmail);
        if (user == null) {
            // 사용자를 찾을 수 없는 경우 404 에러를 반환합니다.
            return ResponseEntity.notFound().build();
        }
        commentService.save(commentDto, user, reviewId);

        return ResponseEntity.ok(commentDto);
    }

}
