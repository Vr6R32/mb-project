package pl.motobudzet.api.infrastructure.mapper;

import pl.motobudzet.api.domain.location.City;
import pl.motobudzet.api.dto.CityDTO;


public class CityMapper {

    private CityMapper() {
    }

    public static CityDTO mapToCityDTO(City city) {
        return CityDTO.builder()
                .id(city.getId())
                .name(city.getName())
                .cityState(CityStateMapper.mapToCityStateDTO(city.getCityState()))
                .build();
    }

}
