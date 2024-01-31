package pl.motobudzet.api.domain.location;

import lombok.AllArgsConstructor;

import java.util.List;

@AllArgsConstructor
public class LocationFacade {

    private final LocationService locationService;

    public List<CityDTO> getCities() {
        return locationService.getAllCities();
    }
    public double calculateDistanceBetweenTwoCities(String cityOne, String cityTwo) {
        return locationService.calculateCityDistance(cityOne, cityTwo);
    }
    public List<City> getCitiesWithinDistance(String city, Integer distanceMax) {
        return locationService.getCitiesWithinDistance(city, distanceMax);
    }
    public City getCityByNameAndState(String cityName, String stateName) {
        return locationService.getCityByNameAndState(cityName, stateName);
    }
    public City getCityByName(String name) {
        return locationService.getCityByNameWithout(name);
    }
    public List<CityDTO> getCityByPartialName(String partialName){
        return locationService.getCityByPartialName(partialName);
    }
    public List<CityStateDTO> getCitiesStates() {
        return locationService.getAllCitiesStates();
    }




}
