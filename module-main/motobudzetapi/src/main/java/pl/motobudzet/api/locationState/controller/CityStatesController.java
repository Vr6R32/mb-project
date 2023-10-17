package pl.motobudzet.api.locationState.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pl.motobudzet.api.locationCity.entity.City;
import pl.motobudzet.api.locationState.dto.CityStateDTO;
import pl.motobudzet.api.locationState.entity.CityState;
import pl.motobudzet.api.locationState.service.CityStateService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "api/cities/states")
public class CityStatesController {

    private final CityStateService cityStateService;

    @GetMapping
    public List<CityStateDTO> getAllCitiesStates() {
        return cityStateService.getAllCitiesStates();
    }


}
