package com.bogopop.back_pop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // @Getter + @Setter + @ToString + @EqualsAndHashCode + @RequiredArgsConstructor
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDto {
    private String content;
    private float popScore;
}
