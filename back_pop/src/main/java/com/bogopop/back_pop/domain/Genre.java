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
public class Genre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(name = "genre_name", nullable = false)
    private String genreName;

    @Column(name = "kor_genre_name", nullable = false)
    private String korGenreName;

}

