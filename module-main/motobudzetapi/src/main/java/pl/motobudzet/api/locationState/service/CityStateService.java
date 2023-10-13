package pl.motobudzet.api.locationState.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.locationCity.entity.City;
import pl.motobudzet.api.locationState.dto.CityStateDTO;
import pl.motobudzet.api.locationState.entity.CityState;
import pl.motobudzet.api.locationState.repository.CityStateRepository;

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
                .stateName(cityState.getName())
                .build();
    }

    public CityState findCityStateByAjdi(Long id) {
        return stateRepository.findByAjdi(id).orElseThrow(() -> new IllegalArgumentException("WRONG_CITY_STATE"));
    }
}
