package pl.motobudzet.api.locationState;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "api/cities/states")
public class CityStateController {

    private final CityStateService cityStateService;

    @GetMapping
    public List<CityStateDTO> getAllCitiesStates() {
        return cityStateService.getAllCitiesStates();
    }


}
