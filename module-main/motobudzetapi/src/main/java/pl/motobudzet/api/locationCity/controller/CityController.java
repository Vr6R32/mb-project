package pl.motobudzet.api.locationCity.controller;


import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.motobudzet.api.locationCity.dto.CityDTO;
import pl.motobudzet.api.locationCity.entity.City;
import pl.motobudzet.api.locationCity.service.CityService;

import java.util.List;

@RestController
@RequestMapping(value = "api/cities")
@AllArgsConstructor
public class CityController {

    private final CityService cityService;

    @GetMapping("all")
    List<CityDTO> getAllCities(){
        return cityService.getAllCities();
    }
    @GetMapping("distance")
    double calculateCityDistance(@RequestParam String cityOne,String cityTwo){
        return cityService.calculateCityDistance(cityOne,cityTwo);
    }
    @GetMapping("neighbours")
    List<City> getCityNeighbourCitiesByDistance(@RequestParam String mainCity , Integer distanceMax){
        return cityService.getNeighbourCitiesByDistance(mainCity,distanceMax);
    }
    @GetMapping("test")
    public City findById(@RequestParam Long id){
        return cityService.getCityById(id);
    }

    @GetMapping
    List<CityDTO> getCityByPartialName(@RequestParam String partialName){
        return cityService.getCityByPartialName(partialName);
    }
}
