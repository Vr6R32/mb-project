package pl.motobudzet.api.domain.location;

import org.springframework.context.annotation.Bean;
import pl.motobudzet.api.persistance.CityRepository;
import pl.motobudzet.api.persistance.CityStateRepository;

public class FactoryLocationService {

    private FactoryLocationService() {
    }

    @Bean
    public static LocationService locationService(CityRepository cityRepository, CityStateRepository cityStateRepository) {
        return new LocationServiceImpl(cityRepository,cityStateRepository);
    }

}
