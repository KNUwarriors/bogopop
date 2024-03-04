package com.bogopop.back_pop.service;

import com.bogopop.back_pop.domain.Movie;
import com.bogopop.back_pop.domain.MovieLike;
import com.bogopop.back_pop.domain.User;
import com.bogopop.back_pop.repository.MovieLikeRepository;
import com.bogopop.back_pop.repository.MovieRepository;
import com.bogopop.back_pop.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LikeService {
    private final MovieLikeRepository movieLikeRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;

    @Transactional
    public void addMovieLike(Long userId, Long movieId) {
        Movie movie = movieRepository.findById(movieId).orElse(null);
        User user = userRepository.findById(userId).orElse(null);

        if (movie != null && user != null && !movieLikeRepository.existsByUserIdAndMovieId(userId, movieId)) {
            //System.out.println(userId);
            // 영화 좋아요 수 증가
            movie.likeChange(movie.getLikes() + 1);

            // 사용자와 영화 간의 좋아요 관계 추가
            movieLikeRepository.save(MovieLike.builder()
                    .userId(user.getId())
                    .movieId(movie.getId())
                    .build());
        }
    }



    @Transactional
    public void deleteMovieLike(Long userId, Long movieId) {
        Movie movie = movieRepository.findById(movieId).orElse(null);
        User user = userRepository.findById(userId).orElse(null);

        if (movie != null && user != null && movieLikeRepository.existsByUserIdAndMovieId(userId, movieId)) {
            // 영화 좋아요 수 감소
            movie.likeChange(movie.getLikes() - 1);

            // 사용자와 영화 간의 좋아요 관계 삭제
            movieLikeRepository.deleteByUserIdAndMovieId(userId, movieId);
        }
    }


    public Boolean checkMovieLike(Long userId, Long movieId) {
        return movieLikeRepository.existsByUserIdAndMovieId(userId, movieId);
    }

}
