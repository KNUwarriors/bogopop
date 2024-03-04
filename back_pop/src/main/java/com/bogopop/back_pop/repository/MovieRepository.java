package com.bogopop.back_pop.repository;

import com.bogopop.back_pop.domain.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    // Add a query method to retrieve movies ordered by movie_id
    //id 오름차순으로 영화 전부다 가져오기
    List<Movie> findAll();

}
