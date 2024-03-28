package com.bogopop.back_pop.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor // Lombok 어노테이션: 기본 생성자 자동 추가
@Getter
@Setter // Lombok 어노테이션: 클래스 내 모든 필드들의 Getter, Setter 자동 생성
@EntityListeners(AuditingEntityListener.class)
@Table(name = "MovieLike")
public class MovieLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long movieId;


    // 생성자, Getter 및 Setter는 Lombok이 자동으로 생성합니다.
}
