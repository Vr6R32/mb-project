package pl.motobudzet.api.locationState;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class CityStateDTO {
    private String id;
    private String name;
}
