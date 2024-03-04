package com.bogopop.back_pop.repository;
import com.bogopop.back_pop.domain.MovieLike;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface MovieLikeRepository extends JpaRepository<MovieLike, Long> {
    void deleteByUserIdAndMovieId(Long userId, Long movieId);
    Boolean existsByUserIdAndMovieId(Long userId, Long movieId);
    List<MovieLike> findAllByUserId(Long userId);
}