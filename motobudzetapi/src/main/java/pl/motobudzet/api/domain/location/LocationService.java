package pl.motobudzet.api.domain.location;
import java.util.List;


public interface LocationService {
    List<CityDTO> getAllCities();
    double calculateCityDistance(String cityOne, String cityTwo);
    List<City> getCitiesWithinDistance(String mainCity, Integer distanceMax);
    City getCityByNameAndState(String cityName, String stateName);
    City getCityByNameWithout(String name);
    List<CityDTO> getCityByPartialName(String partialName);
    List<CityStateDTO> getAllCitiesStates();
}