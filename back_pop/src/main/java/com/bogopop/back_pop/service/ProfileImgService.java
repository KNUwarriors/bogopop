package com.bogopop.back_pop.service;


import com.bogopop.back_pop.domain.Movie;
import com.bogopop.back_pop.domain.ProfileImg;
import com.bogopop.back_pop.repository.MovieRepository;
import com.bogopop.back_pop.repository.ProfileImgRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProfileImgService {
    @Autowired
    private ProfileImgRepository profileImgRepository;
    @Autowired
    private MovieRepository movieRepository;

    public List<ProfileImg> getAllProfileImg() {
        return profileImgRepository.findAll();
    }

    public List<Map<String, String>> getBackdrops() {
        List<Movie> backdropMovies = movieRepository.findTop20ByOrderByPopScoreDescReviewCountDescIdAsc();

        List<Map<String, String>> backdrops = backdropMovies.stream()
                .map(movie -> {
                    Map<String, String> backdropInfo = new HashMap<>();
                    backdropInfo.put("KoreanTitle", movie.getKoreanTitle());
                    backdropInfo.put("backdropPath", movie.getBackdropPath());
                    return backdropInfo;
                })
                .collect(Collectors.toList());

        return backdrops;
    }

}
