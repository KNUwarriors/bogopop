package com.bogopop.back_pop.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity // Entity 클래스 == 테이블과 링크될 클래스
@Builder
@AllArgsConstructor
@NoArgsConstructor // Lombok 어노테이션: 기본 생성자 자동 추가
@Getter @Setter // Lombok 어노테이션: 클래스 내 모든 필드들의 Getter, Setter 자동 생성
@EntityListeners(AuditingEntityListener.class) // JPA Entity에서 이벤트가 발생할 때마다 특정 로직을 실행시킬 수 있는 어노테이션. 즉, AuditingEntityListener 클래스가 callback listener로 지정되어 Entity에서 이벤트가 발생할 때마다 특정 로직을 수행하게 된다.
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

    @Column(nullable = false, columnDefinition = "ENUM('USER', 'ADMIN') DEFAULT 'USER'")
    private String role;


    @Column(nullable = false)
    @CreatedDate // Entity가 생성되어 저장될 때 시간이 자동으로 저장
    private LocalDateTime generated_date;

    @LastModifiedDate // 조회한 Entity의 값을 변경할 때 시간이 자동으로 저장
    private LocalDateTime modified_date;
}
