package pl.motobudzet.api.locationCity.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.locationCity.entity.City;
import pl.motobudzet.api.locationCity.repository.CityRepository;
import pl.motobudzet.api.utils.CoordinateExtractor;
import pl.motobudzet.api.utils.DistanceCalculator;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

import static pl.motobudzet.api.utils.DistanceCalculator.calculateDistance;

@Service
@AllArgsConstructor
public class CityService {

    private final CityRepository cityRepository;
    public List<City> getAllCities() {
        return cityRepository.getAllCitiesWithCityStates();
    }

    public double calculateCityDistance(String cityOne, String cityTwo) {
        City firstCity = cityRepository.getCityByName(cityOne).orElseThrow(() -> new IllegalArgumentException("WRONG_CITY_NAME"));
        City secondCity = cityRepository.getCityByName(cityTwo).orElseThrow(() -> new IllegalArgumentException("WRONG_CITY_NAME"));
        return calculateDistance(firstCity.getNLatitude(),firstCity.getELongitude(),secondCity.getNLatitude(),secondCity.getELongitude());
    }
    public List<City> getCityNeighbourCitiesByDistance(String mainCity, Integer distanceMax) {
        List<City> allCitiesWithCityStates = cityRepository.getAllCitiesWithCityStates();
        City mainLocation = allCitiesWithCityStates.stream()
                .filter(city -> city.getName().equals(mainCity))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("WRONG_CITY_NAME"));

        Double mainLatitude = mainLocation.getNLatitude();
        Double mainLongitude = mainLocation.getELongitude();

        List<City> neighborCities = new LinkedList<>();

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
}
