package pl.motobudzet.api.location_city;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class CityStateDTO {
    private String id;
    private String name;
}
