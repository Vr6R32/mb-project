package pl.motobudzet.api.adapter.facade;

import lombok.AllArgsConstructor;
import pl.motobudzet.api.domain.location.City;
import pl.motobudzet.api.dto.CityDTO;
import pl.motobudzet.api.dto.CityStateDTO;
import pl.motobudzet.api.domain.location.LocationService;

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
    public List<CityDTO> getCityByPartialName(String partialName){
        return locationService.getCityByPartialName(partialName);
    }
    public List<CityStateDTO> getCitiesStates() {
        return locationService.getAllCitiesStates();
    }




}
