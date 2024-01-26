package com.bogopop.back_pop.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity // Entity 클래스 == 테이블과 링크될 클래스
@NoArgsConstructor // Lombok 어노테이션: 기본 생성자 자동 추가
@Getter @Setter // Lombok 어노테이션: 클래스 내 모든 필드들의 Getter, Setter 자동 생성
public class User {
    @Id // 해당 테이블의 PK 필드
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 기본키 생성을 데이터베이스에 위임 -> id 값을 따로 할당하지 않아도 데이터베이스가 자동으로 AUTO_INCREMENT 하여 기본키 생성
    private Long id;
    private String email;
    private String password;
    private String nickname;
    private String profile;
    private String background;
    private String liked_movies;
    private String liked_lists;
    private String my_lists;
    private String my_reviews;
    private String generated_date;
    private String modified_date;

    public User(String nickname, String email, String password) {
        this.nickname = nickname;
        this.email = email;
        this.password = password;
    }


}
