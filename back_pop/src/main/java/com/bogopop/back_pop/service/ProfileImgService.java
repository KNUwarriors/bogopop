package com.bogopop.back_pop.service;


import com.bogopop.back_pop.domain.ProfileImg;
import com.bogopop.back_pop.repository.ProfileImgRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProfileImgService {
    @Autowired
    private ProfileImgRepository profileImgRepository;

    public List<ProfileImg> getAllProfileImg() {
        return profileImgRepository.findAll();
    }
}
