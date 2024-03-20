package com.bogopop.back_pop.service;

import com.bogopop.back_pop.domain.Movie;
import com.bogopop.back_pop.domain.MovieSpecification;
import com.bogopop.back_pop.repository.MovieRepository;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SearchService {

    private final MovieRepository movieRepository;
    private final MovieSpecification movieSpecification;

    public SearchService(MovieRepository movieRepository, MovieSpecification movieSpecification) {
        this.movieRepository = movieRepository;
        this.movieSpecification = movieSpecification;
    }

    public List<Movie> searchMovies(String keyword) {
        Specification<Movie> spec = movieSpecification.searchMovies(keyword);
        List<Movie> movies = movieRepository.findAll(spec);

        if (movies.isEmpty()) {
            return null;
        }

        return movies;
    }
}