package com.bogopop.back_pop.service;

import com.bogopop.back_pop.domain.Movie;
import com.bogopop.back_pop.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    public List<Movie> getAllMoviesOrderedById() {
        return movieRepository.findAllByOrderByIdAsc();
    }
}
