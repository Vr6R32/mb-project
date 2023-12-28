package pl.motobudzet.api.locationCity;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class CityDTO {
    private Long cityId;
    private Long cityStateId;
    private String cityName;
    private String cityStateName;
}
