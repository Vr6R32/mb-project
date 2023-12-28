package pl.motobudzet.api.locationState;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.locationState.CityStateDTO;
import pl.motobudzet.api.locationState.CityState;
import pl.motobudzet.api.locationState.CityStateRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CityStateService {

    private final CityStateRepository stateRepository;

    public String findCityStateByName(String name) {
        CityState cityState = stateRepository.findByName(name).orElseThrow(() -> new IllegalArgumentException("WRONG_CITY_STATE"));
        return cityState.getName();
    }

    public List<CityStateDTO> getAllCitiesStates() {
        return stateRepository.findAllCitiesStates().stream().map(this::mapToCityStateDTO).collect(Collectors.toList());
    }
    public CityStateDTO mapToCityStateDTO(CityState cityState) {
        return CityStateDTO.builder()
                .id(String.valueOf(cityState.getId()))
                .name(cityState.getName())
                .build();
    }

    public CityState findCityStateByAjdi(Long id) {
        return stateRepository.findByAjdi(id).orElseThrow(() -> new IllegalArgumentException("WRONG_CITY_STATE"));
    }
}
