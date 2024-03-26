package com.bogopop.back_pop.domain;

import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class MovieSpecification {

    @Autowired
    private EntityManager entityManager;

    public Specification<Movie> searchMovies(String keyword) {
        return (root, query, criteriaBuilder) -> {
            query.distinct(true); // 중복 제거

            // 검색어로부터 제목, 감독, 출연진에 대한 Predicate 생성
            Predicate titlePredicate = criteriaBuilder.or(
                    criteriaBuilder.like(root.get("koreanTitle"), "%" + keyword + "%"),
                    criteriaBuilder.like(root.get("originalTitle"), "%" + keyword + "%")
            );
            Predicate directorPredicate = criteriaBuilder.like(root.get("directors"), "%" + keyword + "%");
            Predicate castPredicate = criteriaBuilder.like(root.get("cast"), "%" + keyword + "%");
            Predicate overviewPredicate = criteriaBuilder.like(root.get("overview"), "%"+keyword+"%");

            // 장르명으로부터 해당하는 genre_id 찾기
            Long genreId = findGenreId(keyword);

            // 영화 테이블에서 해당 장르 ID가 포함된 영화를 검색
            Predicate genrePredicate = null;
            if (genreId != null) {
                genrePredicate = criteriaBuilder.like(root.get("genres"), "%" + genreId + "%");
            }

            // 모든 Predicate를 OR 조건으로 결합하여 반환
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(titlePredicate);
            predicates.add(directorPredicate);
            predicates.add(castPredicate);
            predicates.add(overviewPredicate);
            if (genrePredicate != null) {
                predicates.add(genrePredicate);
            }

            return criteriaBuilder.or(predicates.toArray(new Predicate[0]));
        };
    }

    private Long findGenreId(String genreName) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> query = cb.createQuery(Long.class);
        Root<Genre> root = query.from(Genre.class);
        query.select(root.get("id")).where(cb.or(
                cb.like(root.get("genreName"), "%" + genreName + "%"),
                cb.like(root.get("korGenreName"), "%" + genreName + "%")
        ));
        try {
            return entityManager.createQuery(query).getSingleResult();
        } catch (jakarta.persistence.NoResultException e) {
            // 장르가 존재하지 않을 경우
            return null;
        }
    }
}
