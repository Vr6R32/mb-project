package pl.motobudzet.api.locationCity.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class CityDTO {
    private String cityId;
    private String cityName;
    private String cityStateId;
}
