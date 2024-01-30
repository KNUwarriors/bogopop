package com.bogopop.back_pop.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf((csrfConfig) ->
                        //CSRF(Cross-Site Request Forgery) 공격을 방지하기 위한 Spring Security의 기능을 비활성화
                        csrfConfig.disable()
                )
                .headers((headerConfig) ->
                        headerConfig.frameOptions(frameOptionsConfig ->
                                //프레임 옵션을 비활성화하여 웹 페이지가 다른 프레임에서 로드되는 것을 허용
                                frameOptionsConfig.disable()
                        )
                )
                .formLogin((formLogin) ->
                        formLogin
                                .loginPage("/login/login")
                                .usernameParameter("username")
                                .passwordParameter("password")
                                .loginProcessingUrl("/login/login-proc")
                                .defaultSuccessUrl("/", true)
                );

        return http.build();
    }



}
