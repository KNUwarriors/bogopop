package com.bogopop.back_pop.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@EqualsAndHashCode(of = "id")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String korean_title;
    @Column(nullable = false)
    private String original_title;

    private String release_date;

    //오버뷰는 기니까 large object 어노테이션 추가해주자
    @Lob
    private String overview;

    private int runtime;

    private int adult;

    private String poster_path;
    private String backdrop_path;

    @Column(nullable = false)
    private Long TMDB_id;

    private String directors;
    private String cast;

    private String trailer;

}
