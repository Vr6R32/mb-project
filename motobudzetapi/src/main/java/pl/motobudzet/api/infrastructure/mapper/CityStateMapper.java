package pl.motobudzet.api.infrastructure.mapper;

import pl.motobudzet.api.domain.location.CityState;
import pl.motobudzet.api.domain.location.CityStateDTO;

public class CityStateMapper {

    private CityStateMapper() {
    }

    public static CityStateDTO mapToCityStateDTO(CityState cityState) {
        return CityStateDTO.builder()
                .id(String.valueOf(cityState.getId()))
                .name(cityState.getName())
                .build();
    }
}
