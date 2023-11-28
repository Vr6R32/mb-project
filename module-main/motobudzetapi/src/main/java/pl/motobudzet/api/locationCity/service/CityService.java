package pl.motobudzet.api.locationCity.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.locationCity.dto.CityDTO;
import pl.motobudzet.api.locationCity.entity.City;
import pl.motobudzet.api.locationCity.repository.CityRepository;
import pl.motobudzet.api.utils.mappers.CityMapper;

import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

import static pl.motobudzet.api.utils.DistanceCalculator.calculateDistance;

@Service
@AllArgsConstructor
public class CityService {

    private final CityRepository cityRepository;
    public List<CityDTO> getAllCities() {
        return cityRepository.getAllCitiesWithCityStates().stream().map(CityMapper::mapToCityDTO).collect(Collectors.toList());
    }

    public double calculateCityDistance(String cityOne, String cityTwo) {
        City firstCity = cityRepository.getCityByNameWithState(cityOne).orElseThrow(() -> new IllegalArgumentException("WRONG_CITY_NAME"));
        City secondCity = cityRepository.getCityByNameWithState(cityTwo).orElseThrow(() -> new IllegalArgumentException("WRONG_CITY_NAME"));
        return calculateDistance(firstCity.getNLatitude(),firstCity.getELongitude(),secondCity.getNLatitude(),secondCity.getELongitude());
    }
    public List<City> getNeighbourCitiesByDistance(String mainCity, Integer distanceMax) {
        System.out.println("city: " + mainCity);
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



    public City getCityByNameAndState(String cityName,String stateName) {
        return cityRepository.getCityByNameAndState(cityName,stateName.toUpperCase()).orElseThrow(() -> new IllegalArgumentException("WRONG_CITY_NAME"));
    }

    public City getCityByNameWithout(String name) {
        return cityRepository.getCityByNameWithoutState(name).orElseThrow(() -> new IllegalArgumentException("WRONG_CITY_NAME"));
    }
    public City getCityById(Long city) {
        return cityRepository.getCityById(city).orElseThrow(() -> new IllegalArgumentException("WRONG_CITY_NAME"));
    }

    public List<CityDTO> getCityByPartialName(String partialName) {
        return cityRepository.findByPartialName(partialName).stream().map(CityMapper::mapToCityDTO).collect(Collectors.toList());
    }
}
