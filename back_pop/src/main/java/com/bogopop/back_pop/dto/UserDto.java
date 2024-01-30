package com.bogopop.back_pop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.userdetails.User;

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

    public void setUserpw(String userpw) {
        this.password = userpw;
    }

    public String getUserpw() {
        return password;
    }


}
