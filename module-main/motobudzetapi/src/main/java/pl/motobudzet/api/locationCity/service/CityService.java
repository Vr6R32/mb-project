package pl.motobudzet.api.locationCity.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.locationCity.entity.City;
import pl.motobudzet.api.locationCity.repository.CityRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class CityService {

    private final CityRepository cityRepository;
    public List<City> getAllCities() {
        return cityRepository.getAllCitiesWithCityStates();
    }

}
