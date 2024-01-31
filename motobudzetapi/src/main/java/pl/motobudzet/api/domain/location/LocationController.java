package pl.motobudzet.api.domain.location;


import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "api/cities")
@AllArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @GetMapping("all")
    List<CityDTO> getAllCities() {
        return locationService.getAllCities();
    }

    @GetMapping("neighbours")
    List<City> getCityNeighbourCitiesByDistance(@RequestParam String mainCity, Integer distanceMax) {
        return locationService.getCitiesWithinDistance(mainCity, distanceMax);
    }

    @GetMapping("states")
    public List<CityStateDTO> getAllCitiesStates() {
        return locationService.getAllCitiesStates();
    }
    @GetMapping
    List<CityDTO> getCityByPartialName(@RequestParam String partialName) {
        return locationService.getCityByPartialName(partialName);
    }

    @GetMapping("test")
    public City findById(@RequestParam Long id) {
        return locationService.getCityById(id);
    }

    @GetMapping("distance")
    double calculateCityDistance(@RequestParam String cityOne, String cityTwo) {
        return locationService.calculateCityDistance(cityOne, cityTwo);
    }

}
