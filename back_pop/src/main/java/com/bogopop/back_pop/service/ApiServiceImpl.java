package com.bogopop.back_pop.service;

import com.bogopop.back_pop.domain.Movie;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.bogopop.back_pop.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
@Slf4j
public class ApiServiceImpl {

    private final MovieRepository movieRepository;

    LocalDateTime dateTime = LocalDateTime.now();

    public String getInfo(String result) {

        JsonArray list = null;

        log.info("서비스 시작" );
        JsonParser jsonParser = new JsonParser();
        JsonObject jsonObject = (JsonObject) jsonParser.parse(result);
        list = (JsonArray) jsonObject.get("results");

        for (int k = 0; k < list.size(); k++) {
            JsonObject contents = (JsonObject) list.get(k);

            String ImgUrl = "https://image.tmdb.org/t/p/original";
            String match = "[\"]";

            movieRepository.save(
                    Movie.builder()
                            .description(contents.get("overview").toString().replaceAll(match, ""))
                            .title(contents.get("title").toString().replaceAll(match, ""))
                            .imgUrl(ImgUrl + contents.get("poster_path").toString().replaceAll(match, ""))
                            .createdAt(dateTime)
                            .modifiedAt(dateTime)
                            .build()
            );

        }
        return "ok";
    }

}