package pl.motobudzet.api.domain.location;
import pl.motobudzet.api.dto.CityDTO;
import pl.motobudzet.api.dto.CityStateDTO;

import java.util.List;


public interface LocationService {
    List<CityDTO> getAllCities();
    double calculateCityDistance(String cityOne, String cityTwo);
    List<City> getCitiesWithinDistance(String mainCity, Integer distanceMax);
    City getCityByNameAndState(String cityName, String stateName);
    List<CityDTO> getCityByPartialName(String partialName);
    List<CityStateDTO> getAllCitiesStates();
}