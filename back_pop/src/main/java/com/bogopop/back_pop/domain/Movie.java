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

    private String korean_title;
    @Column(nullable = false)
    private String original_title;

    private String release_date;

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