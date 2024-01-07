package pl.motobudzet.api.location_city;

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
