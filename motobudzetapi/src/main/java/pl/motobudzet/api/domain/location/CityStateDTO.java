package pl.motobudzet.api.domain.location;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class CityStateDTO {
    private String id;
    private String name;
}
