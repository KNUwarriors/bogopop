package com.bogopop.back_pop.controller;

import com.bogopop.back_pop.domain.Movie;
import com.bogopop.back_pop.service.MovieService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.List;
import java.util.Optional;

@Controller
public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping("/movies")
    @ApiOperation("모든 영화 정보를(id 오름차순) 가져오는 메소드")
    @ResponseBody
    public List<Movie> getAllMovies() {
        return movieService.getAllMovies();
    }

}
