package pl.motobudzet.api.locationCity.controller;


import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.motobudzet.api.locationCity.entity.City;
import pl.motobudzet.api.locationCity.service.CityService;

import java.util.List;

@RestController
@RequestMapping(value = "api/cities")
@AllArgsConstructor
public class CityController {

    private final CityService cityService;

    @GetMapping
    List<City> getAllCities(){
        return cityService.getAllCities();
    }

}
