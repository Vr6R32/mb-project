package pl.motobudzet.api.utils;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import pl.motobudzet.api.locationCity.City;
import pl.motobudzet.api.locationCity.CityRepository;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DBInserter {

    private final CityRepository cityRepository;

//    @EventListener(ApplicationReadyEvent.class)
    public void insertCoordinates(){
        List<City> allCitiesWithCityStates = cityRepository.getAllCitiesWithCityStates();

        List<City> txtList = CoordinateExtractor.extractCoordinates();

        for (City newCity:txtList) {
            for (City oldCity:allCitiesWithCityStates) {
                if (newCity.getName().equals(oldCity.getName())){
                    oldCity.setELongitude(newCity.getELongitude());
                    oldCity.setNLatitude(newCity.getNLatitude());
                }
            }
        }

        cityRepository.saveAll(allCitiesWithCityStates);

    }
}
