package pl.motobudzet.api.user.dto;


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
