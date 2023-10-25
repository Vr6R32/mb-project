package pl.motobudzet.api.locationCity.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.locationCity.dto.CityDTO;
import pl.motobudzet.api.locationCity.entity.City;
import pl.motobudzet.api.locationCity.repository.CityRepository;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

import static pl.motobudzet.api.utils.DistanceCalculator.calculateDistance;

@Service
@AllArgsConstructor
public class CityService {

    private final CityRepository cityRepository;
    public List<CityDTO> getAllCities() {
        return cityRepository.getAllCitiesWithCityStates().stream().map(this::mapToCityDTO).collect(Collectors.toList());
    }

    private CityDTO mapToCityDTO(City city) {
        return CityDTO.builder()
                .cityId(String.valueOf(city.getId()))
                .cityName(city.getName())
                .cityStateId(String.valueOf(city.getCityState().getId()))
                .cityStateName(city.getCityState().getName())
                .build();
    }

    public double calculateCityDistance(String cityOne, String cityTwo) {
        City firstCity = cityRepository.getCityByName(cityOne).orElseThrow(() -> new IllegalArgumentException("WRONG_CITY_NAME"));
        City secondCity = cityRepository.getCityByName(cityTwo).orElseThrow(() -> new IllegalArgumentException("WRONG_CITY_NAME"));
        return calculateDistance(firstCity.getNLatitude(),firstCity.getELongitude(),secondCity.getNLatitude(),secondCity.getELongitude());
    }
    public List<City> getNeighbourCitiesByDistance(String mainCity, Integer distanceMax) {
        List<City> allCitiesWithCityStates = cityRepository.getAllCitiesWithCityStates();
        City mainLocation = allCitiesWithCityStates.stream()
                .filter(city -> city.getName().equals(mainCity))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("WRONG_CITY_NAME"));

        Double mainLatitude = mainLocation.getNLatitude();
        Double mainLongitude = mainLocation.getELongitude();

        List<City> neighborCities = new LinkedList<>();
        neighborCities.add(mainLocation);

        for (City city : allCitiesWithCityStates) {
            if (!city.getName().equals(mainCity)) {
                double distance = calculateDistance(mainLatitude, mainLongitude, city.getNLatitude(), city.getELongitude());
                if (distance <= distanceMax) {
                    neighborCities.add(city);
                }
            }
        }

        return neighborCities;
    }

    public City getCityByName(String name) {
        return cityRepository.getCityByName(name).orElseThrow(() -> new IllegalArgumentException("WRONG_CITY_NAME"));
    }

    public City getCityByNameAndState(String cityName,String stateName) {
        return cityRepository.getCityByNameAndState(cityName,stateName).orElseThrow(() -> new IllegalArgumentException("WRONG_CITY_NAME"));
    }

    public City getCityByNameWithout(String name) {
        return cityRepository.getCityByNameWithout(name).orElseThrow(() -> new IllegalArgumentException("WRONG_CITY_NAME"));
    }
    public City getCityById(Long city) {
        return cityRepository.getCityById(city).orElseThrow(() -> new IllegalArgumentException("WRONG_CITY_NAME"));
    }

    public List<CityDTO> getCityByPartialName(String partialName) {
        return cityRepository.findByPartialName(partialName).stream().map(this::mapToCityDTO).collect(Collectors.toList());
    }
}
