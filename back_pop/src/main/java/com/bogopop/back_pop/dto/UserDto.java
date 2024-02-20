package com.bogopop.back_pop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // @Getter + @Setter + @ToString + @EqualsAndHashCode + @RequiredArgsConstructor
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private String email;

    private String password;

    private String nickname;

    private String profile;

    private String background;

    private String role;  // 추가된 부분

    @Builder
    public UserDto(String email, String password) {
        this.email = email;
        this.password = password;
        this.role = role;
    }

}
