package pl.motobudzet.api.domain.location;

import lombok.AllArgsConstructor;
import pl.motobudzet.api.dto.CityDTO;
import pl.motobudzet.api.dto.CityStateDTO;
import pl.motobudzet.api.infrastructure.mapper.CityMapper;
import pl.motobudzet.api.infrastructure.mapper.CityStateMapper;
import pl.motobudzet.api.persistance.CityRepository;
import pl.motobudzet.api.persistance.CityStateRepository;

import java.util.LinkedList;
import java.util.List;


@AllArgsConstructor
class LocationServiceImpl implements LocationService {

    private final CityRepository cityRepository;
    private final CityStateRepository stateRepository;

    public List<CityDTO> getAllCities() {
        return cityRepository.getAllCities().stream().map(CityMapper::mapToCityDTO).toList();
    }
    public double calculateCityDistance(String cityOne, String cityTwo) {
        City firstCity = cityRepository.getCityByName(cityOne).orElseThrow(InvalidCityException::new);
        City secondCity = cityRepository.getCityByName(cityTwo).orElseThrow(InvalidCityException::new);
        return DistanceCalculator.calculateDistance(firstCity.getNLatitude(), firstCity.getELongitude(), secondCity.getNLatitude(), secondCity.getELongitude());
    }

    public List<City> getCitiesWithinDistance(String mainCity, Integer distanceMax) {
        List<City> allCitiesWithCityStates = cityRepository.getAllCities();
        City mainLocation = allCitiesWithCityStates.stream()
                .filter(city -> city.getName().equals(mainCity))
                .findFirst()
                .orElseThrow(InvalidCityException::new);

        Double mainLatitude = mainLocation.getNLatitude();
        Double mainLongitude = mainLocation.getELongitude();

        List<City> neighborCities = new LinkedList<>();
        neighborCities.add(mainLocation);

        for (City city : allCitiesWithCityStates) {
            if (!city.getName().equals(mainCity)) {
                double distance = DistanceCalculator.calculateDistance(mainLatitude, mainLongitude, city.getNLatitude(), city.getELongitude());
                if (distance <= distanceMax) {
                    neighborCities.add(city);
                }
            }
        }
        return neighborCities;
    }

    public City getCityByNameAndState(String cityName, String stateName) {
        return cityRepository.getCityByNameAndState(cityName, stateName.toUpperCase()).orElseThrow(InvalidCityException::new);
    }

    public List<CityDTO> getCityByPartialName(String partialName) {
        return cityRepository.findByPartialName(partialName).stream().map(CityMapper::mapToCityDTO).toList();
    }

    public List<CityStateDTO> getAllCitiesStates() {
        return stateRepository.findAllCitiesStates().stream().map(CityStateMapper::mapToCityStateDTO).toList();
    }
}
