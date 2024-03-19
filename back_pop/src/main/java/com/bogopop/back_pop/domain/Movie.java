package com.bogopop.back_pop.domain;

import jakarta.persistence.*;
import lombok.*;

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

    @Column(nullable = false)
    private Long TMDB_id;

    @Column(nullable = false)
    private String original_title;

    private String korean_title;

    private String directors;

    private String cast;

    private String release_date;

    private String overview;

    private String genres;

    private int runtime;

    private String poster_path;

    private String backdrop_path;

    private String trailer;

    @Column(nullable = false)
    private Long likes;

    @Column(name = "pop_score", nullable = false)
    private float popScore;

    private boolean adult;

    @Column(name = "review_count", nullable = false)
    private float reviewCount;

}

