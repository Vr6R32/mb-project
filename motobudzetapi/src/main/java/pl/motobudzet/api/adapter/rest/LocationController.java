package pl.motobudzet.api.adapter.rest;


import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.motobudzet.api.adapter.facade.LocationFacade;
import pl.motobudzet.api.domain.location.City;
import pl.motobudzet.api.dto.CityDTO;
import pl.motobudzet.api.dto.CityStateDTO;

import java.util.List;

@RestController
@RequestMapping(value = "api/cities")
@AllArgsConstructor
class LocationController {

    private final LocationFacade locationFacade;

    @GetMapping("all")
    List<CityDTO> getAllCities() {
        return locationFacade.getCities();
    }

    @GetMapping("states")
    public List<CityStateDTO> getAllCitiesStates() {
        return locationFacade.getCitiesStates();
    }

    @GetMapping
    List<CityDTO> getCityByPartialName(@RequestParam String partialName) {
        return locationFacade.getCityByPartialName(partialName);
    }

    @GetMapping("distance")
    double calculateCityDistance(@RequestParam String cityOne, String cityTwo) {
        return locationFacade.calculateDistanceBetweenTwoCities(cityOne, cityTwo);
    }

    @GetMapping("neighbours")
    List<City> getCityNeighbourCitiesByDistance(@RequestParam String mainCity, Integer distanceMax) {
        return locationFacade.getCitiesWithinDistance(mainCity, distanceMax);
    }

}
