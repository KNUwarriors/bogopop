package com.bogopop.back_pop.repository;

import com.bogopop.back_pop.domain.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.transaction.annotation.Transactional;

@Transactional(readOnly = true)
public interface MovieRepository extends JpaRepository<Movie,Long>, QuerydslPredicateExecutor<Movie> {


    Page<Movie> findAllByOrderByCreatedAtDesc(Pageable pageable);

//    @Query(value = "select A.* , B.average " +
//            "from movie as A " +
//            "left outer join (select movie_id, round(avg(star_rate),1) as average from comment group by movie_id) as B " +
//            "on A.id = B.movie_id order by average is null asc, average desc, A.created_at desc " +
//            "limit :start, :offset"
//            ,nativeQuery = true)
//    List<Movie> findAllByOrderByStarRate(int start, int offset);
//
//    @Query(value = "select A.*, B.total " +
//            "from movie as A " +
//            "left outer join(select movie_id, sum(IF(is_heart = true, 1, 0)) as total from heart group by movie_id) as B " +
//            "on A.id = B.movie_id order by total is null asc, total desc, A.created_at desc " +
//            "limit :start, :offset"
//            ,nativeQuery = true)
//    List<Movie> findAllByOrderByHeart(int start, int offset);
}
