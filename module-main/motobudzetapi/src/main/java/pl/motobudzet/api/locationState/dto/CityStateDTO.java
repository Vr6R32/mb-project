package pl.motobudzet.api.locationState.dto;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class CityStateDTO {
    private String id;
    private String stateName;
}
