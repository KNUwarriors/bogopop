package com.bogopop.back_pop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing // JPA Auditing(감시, 감사) 기능을 활성화하기 위한 어노테이션입니다. 해당 어노테이션을 적용함으로써 createdDate, lastModifiedDate처럼 DB에 데이터가 저장되거나 수정될 때 언제, 누가 했는지를 자동으로 관리할 수 있게 된다.
@SpringBootApplication
public class BackPopApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackPopApplication.class, args);
    }

}
