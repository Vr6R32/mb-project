package pl.motobudzet.api.user_account.dto;


import lombok.*;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class AppUserDTO {
    private String name;
    private String cityName;
    private String cityStateName;
}
