package com.bogopop.back_pop.repository;

import com.bogopop.back_pop.domain.ProfileImg;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfileImgRepository extends JpaRepository<ProfileImg, Long> {

    @Override
    List<ProfileImg> findAll();



}