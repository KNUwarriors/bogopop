package com.bogopop.back_pop.repository;

import com.bogopop.back_pop.domain.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface MovieRepository extends JpaRepository<Movie, Long>, JpaSpecificationExecutor<Movie> {
    @Override
    Optional<Movie> findById(Long aLong);

    //id 오름차순으로 영화 전부다 가져오기
    List<Movie> findAll();

    List<Movie> findTop20ByOrderByLikesDescReviewCountDescIdAsc();

    List<Movie> findTop20ByOrderByPopScoreDescReviewCountDescIdAsc();

    // 영화 랭킹 => 하트 수, 평점, 평점 수 순으로 반영하여 내림차순 정렬
    List<Movie> findTop20ByOrderByLikesDescPopScoreDescReviewCountDescIdAsc();

}
