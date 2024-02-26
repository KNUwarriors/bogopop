package com.bogopop.back_pop.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity // Entity 클래스 == 테이블과 링크될 클래스
@Builder
@AllArgsConstructor
@NoArgsConstructor // Lombok 어노테이션: 기본 생성자 자동 추가
@Getter
@Setter // Lombok 어노테이션: 클래스 내 모든 필드들의 Getter, Setter 자동 생성
@EntityListeners(AuditingEntityListener.class) // JPA Entity에서 이벤트가 발생할 때마다 특정 로직을 실행시킬 수 있는 어노테이션. 즉, AuditingEntityListener 클래스가 callback listener로 지정되어 Entity에서 이벤트가 발생할 때마다 특정 로직을 수행하게 된다.
@Table(name = "Review")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long user_id;

    private Long movie_id;

    @Column(nullable = false)
    @CreatedDate // Entity가 생성되어 저장될 때 시간이 자동으로 저장
    private LocalDateTime generated_date;

    private String content;

    private Long likes;

    private String comments;

}
