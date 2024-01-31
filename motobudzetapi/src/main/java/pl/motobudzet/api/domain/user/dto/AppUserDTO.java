package pl.motobudzet.api.domain.user.dto;


import lombok.*;
import pl.motobudzet.api.domain.location.CityDTO;
import pl.motobudzet.api.domain.location.CityStateDTO;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class AppUserDTO {
    private String name;
    private CityDTO cityName;
    private CityStateDTO cityStateName;
}
