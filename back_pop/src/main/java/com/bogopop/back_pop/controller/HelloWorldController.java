// src/main/java/com.demogroup.demoweb/Controller/HelloWorldController.java

package com.bogopop.back_pop.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
public class HelloWorldController {

    @GetMapping("/api/data")
    public String test(){
        return "Hello, world";
    }
}