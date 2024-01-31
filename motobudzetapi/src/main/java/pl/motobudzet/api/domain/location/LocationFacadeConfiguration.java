package pl.motobudzet.api.domain.location;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
@AllArgsConstructor
public class LocationFacadeConfiguration {

    private final CityRepository cityRepository;
    private final CityStateRepository cityStateRepository;

    @Bean
    LocationFacade locationFacade() {
        LocationService locationService = new LocationService(cityRepository,cityStateRepository);
        return new LocationFacade(locationService);
    }

}
