package pl.motobudzet.api.domain.location;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class CityDTO {
    private Long id;
    private String name;
    private CityStateDTO cityState;
}
