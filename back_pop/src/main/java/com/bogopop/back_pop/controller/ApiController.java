package com.bogopop.back_pop.controller;


import com.bogopop.back_pop.service.ApiServiceImpl;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Controller
@Slf4j
@RequiredArgsConstructor
@Api(tags = {"영화 정보 API에서 정보를 가져오는 Controller"})
public class ApiController {

    private final ApiServiceImpl ApiService;
    private final String KEY = "94433";

    private String result = "";

    // 총 페이지를 알아내기 위한 컨트롤러
    @ResponseBody
    @GetMapping("/api/movie/getPages")
    @ApiOperation("영화 정보 총 페이지를 알기 위한 메소드")
    public int getPages() {

        int page = 0 ;

        log.info("getPage Service 시작!");

        try {
            URL url = new URL("https://api.themoviedb.org/3/discover/movie?api_key="
                    + KEY + "&release_date.gte=2022-01-01&watch_region=KR&language=ko&include");

            BufferedReader bf;

            bf = new BufferedReader(new InputStreamReader(url.openStream(), "UTF-8"));

            result = bf.readLine();

            JsonParser jsonParser = new JsonParser();

            JsonObject jsonObject = (JsonObject) jsonParser.parse(result);

            String pages = jsonObject.get("total_pages").toString();

            page = Integer.parseInt(pages);

        } catch (Exception e) {
            e.printStackTrace();
        }

        log.info("getPage Service 끝!");

        return page;
    }

    // api 정보를 DB에 저장 (apiservice에서 처리)
    @ResponseBody
    @GetMapping("/api/movie/getInfo")
    @ApiOperation(value = "영화 정보를 저장하는 메소드")
    public String getInfo() {

        int pages = 1;

        try {

            for (int i = 1; i <= 5; i++) {
                String apiURL = "https://api.themoviedb.org/3/discover/movie?api_key=" + KEY
                        + "&release_date.gte=2013-01-01&watch_region=KR&language=ko&page=" + i;

                URL url = new URL(apiURL);

                BufferedReader bf;

                bf = new BufferedReader(new InputStreamReader(url.openStream(), "UTF-8"));

                result = bf.readLine();

                ApiService.getInfo(result);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return "ok";
    }
}