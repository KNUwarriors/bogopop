package com.bogopop.back_pop.service;

import com.bogopop.back_pop.domain.Movie;
import com.bogopop.back_pop.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepository;

    //영화id 오름차순으로 모두 출력
    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Movie getMovieByMovieId(Long movieId){
        return movieRepository.findById(movieId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + movieId));
    }

}
