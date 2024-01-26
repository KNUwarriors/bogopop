package com.bogopop.back_pop.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Entity // Entity 클래스 == 테이블과 링크될 클래스
@Builder
@AllArgsConstructor
@NoArgsConstructor // Lombok 어노테이션: 기본 생성자 자동 추가
@Getter @Setter // Lombok 어노테이션: 클래스 내 모든 필드들의 Getter, Setter 자동 생성
@Table(name = "User")
public class User {
    @Id // 해당 테이블의 PK 필드
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 기본키 생성을 데이터베이스에 위임 -> id 값을 따로 할당하지 않아도 데이터베이스가 자동으로 AUTO_INCREMENT 하여 기본키 생성
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String nickname;

    @Column(nullable = false)
    private String profile;

    @Column(nullable = false)
    private String background;

    private String liked_movies;
    private String liked_lists;
    private String my_lists;
    private String my_reviews;

    @Column(nullable = false)
    @CreatedDate
    private LocalDateTime generated_date;

    @LastModifiedDate
    private LocalDateTime modified_date;
}
