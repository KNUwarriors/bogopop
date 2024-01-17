package com.bogopop.back_pop.controller;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import com.bogopop.back_pop.domain.Movie;
import com.bogopop.back_pop.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Api(tags = {"전체 영화 정보를 제공하는 Controller"})
public class MovieController {

    private final MovieRepository movieRepository;

    @GetMapping("/api/movies")
    @ApiOperation("현재 영화 정보를 조회하는 메소드")
    public Page<Movie> getAllMovies(
            @RequestParam("page") int page, // 요청페이지
            @RequestParam("size") int size, // 요청 사이즈 (게시글에 몇개씩 보여줄지)
            @RequestParam("sort") String sort // 정렬 기준 최신순, 좋아요순, 평점순
    ) {

        Pageable pageable = PageRequest.of(page-1, size);

//        if(sort.equals("starRate")) {
//            int start = (page-1) * size;
//            List<Movie> movieList  = movieRepository.findAllByOrderByStarRate(start, size);
//            return new PageImpl<>(movieList, pageable, movieList.size());
//        }
//
//        if(sort.equals("heart")) {
//            int start = (page-1) * size;
//            List<Movie> movieList  = movieRepository.findAllByOrderByHeart(start, size);
//            return new PageImpl<>(movieList, pageable, movieList.size());
//        }

        Page<Movie> movies = movieRepository.findAllByOrderByCreatedAtDesc(pageable);
        return movies;
    }

    @ApiOperation("상세 영화 정보를 조회하는 메소드")
    @GetMapping("/api/movies/{movie_id}")
    public Movie getMovieById(@PathVariable Long movie_id) {
        Movie movie = movieRepository.findById(movie_id).orElse(null);
        return movie;
    }

}