package com.bogopop.back_pop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
@AllArgsConstructor
public class JwtToken {
    //JWT의 인증타입을 설정하는 변수
    private String grantType;
    //http authorization헤더에 포함되어 전송되는 토큰
    private String accessToken;
    private String refreshToken;
}