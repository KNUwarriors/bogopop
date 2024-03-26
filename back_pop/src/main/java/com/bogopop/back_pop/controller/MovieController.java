package com.bogopop.back_pop.controller;

import com.bogopop.back_pop.domain.Movie;
import com.bogopop.back_pop.repository.MovieRepository;
import com.bogopop.back_pop.service.MovieService;
import com.bogopop.back_pop.service.SearchService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class MovieController {

    @Autowired
    private MovieService movieService;
    @Autowired
    private MovieRepository movieRepository;
    @Autowired
    private SearchService searchService;


    @GetMapping("/movies")
    @ApiOperation("모든 영화 정보를(id 오름차순) 가져오는 메소드")
    @ResponseBody
    public List<Movie> getAllMovies() {
        return movieService.getAllMovies();
    }

//    @GetMapping("/movies/popularMovies")
//    @ApiOperation("인기영화 20개 출력")
//    @ResponseBody
//    public List<Movie> getPopularMovies() {
//        List<Movie> popularMovies = movieRepository.findTop20ByOrderByLikesDescReviewCountDescIdAsc();
//        return popularMovies;
//    }
//
//    @GetMapping("/movies/MoviesByPopScore")
//    @ApiOperation("인기영화 20개 출력")
//    @ResponseBody
//    public List<Movie> getMoviesByPopScore() {
//        List<Movie> MoviesByPopScore = movieRepository.findTop20ByOrderByPopScoreDescReviewCountDescIdAsc();
//        return MoviesByPopScore;
//    }

    @GetMapping("/movies/OrderedMovies")
    @ApiOperation("인기영화 20개 출력")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getOrderedMovies() {
        List<Movie> popularMovies = movieRepository.findTop20ByOrderByLikesDescReviewCountDescIdAsc();
        List<Movie> MoviesByPopScore = movieRepository.findTop20ByOrderByPopScoreDescReviewCountDescIdAsc();

        Map<String, Object> orderedMovieData = new HashMap<>();
        orderedMovieData.put("popularMovies", popularMovies);
        orderedMovieData.put("moviesByPopScore", MoviesByPopScore);

        return ResponseEntity.ok(orderedMovieData);
    }

    @GetMapping("/movies/search")
    @ApiOperation("검색기능")
    @ResponseBody
    public ResponseEntity<?> searchMovies(@RequestParam String keyword) {
        try {
            List<Movie> searchResult = searchService.searchMovies(keyword);

            if (searchResult == null || searchResult.isEmpty()) {
                return ResponseEntity.ok("noresult");
            } else {
                return ResponseEntity.ok(searchResult);
            }
        } catch (EmptyResultDataAccessException e) {
            return ResponseEntity.ok("noresult");
        }
    }

    @GetMapping("/movies/ranking")
    @ApiOperation("영화 랭킹")
    public List<Movie> getMovieRanking(){
        return movieService.getMovieRanking();
    }
}
