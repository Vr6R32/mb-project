package pl.motobudzet.api.z_playground.data_extract_scripts.db_inserter;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import pl.motobudzet.api.domain.location.City;
import pl.motobudzet.api.persistance.CityRepository;
import pl.motobudzet.api.z_playground.data_extract_scripts.CoordinateExtractor;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DBInserter {

    private final CityRepository cityRepository;

    //    @EventListener(ApplicationReadyEvent.class)
    public void insertCoordinates() {
        List<City> allCitiesWithCityStates = cityRepository.getAllCities();

        List<City> txtList = CoordinateExtractor.extractCoordinates();

        for (City newCity : txtList) {
            for (City oldCity : allCitiesWithCityStates) {
                if (newCity.getName().equals(oldCity.getName())) {
                    oldCity.setELongitude(newCity.getELongitude());
                    oldCity.setNLatitude(newCity.getNLatitude());
                }
            }
        }

        cityRepository.saveAll(allCitiesWithCityStates);

    }
}
