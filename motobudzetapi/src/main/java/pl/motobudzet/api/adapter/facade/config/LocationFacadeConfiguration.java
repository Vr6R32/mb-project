package pl.motobudzet.api.adapter.facade.config;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pl.motobudzet.api.adapter.facade.LocationFacade;
import pl.motobudzet.api.domain.location.FactoryLocationService;
import pl.motobudzet.api.domain.location.LocationService;
import pl.motobudzet.api.persistance.CityRepository;
import pl.motobudzet.api.persistance.CityStateRepository;


@Configuration
@AllArgsConstructor
class LocationFacadeConfiguration {

    private final CityRepository cityRepository;
    private final CityStateRepository cityStateRepository;

    @Bean
    LocationFacade locationFacade() {
        LocationService locationService = FactoryLocationService.locationService(cityRepository, cityStateRepository);
        return new LocationFacade(locationService);
    }

}
