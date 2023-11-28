package pl.motobudzet.api.utils.mappers;

import pl.motobudzet.api.locationCity.dto.CityDTO;
import pl.motobudzet.api.locationCity.entity.City;

public class CityMapper {
    private CityMapper() {
    }

    public static CityDTO mapToCityDTO(City city) {
        return CityDTO.builder()
                .cityId(String.valueOf(city.getId()))
                .cityName(city.getName())
                .cityStateId(String.valueOf(city.getCityState().getId()))
                .cityStateName(city.getCityState().getName())
                .build();
    }
}
