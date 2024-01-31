package pl.motobudzet.api.domain.advertisement.service;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pl.motobudzet.api.domain.advertisement.repository.AdvertisementRepository;
import pl.motobudzet.api.domain.brand.BrandFacade;
import pl.motobudzet.api.domain.location.LocationFacade;
import pl.motobudzet.api.domain.model.ModelFacade;
import pl.motobudzet.api.infrastructure.file_manager.FileManagerFacade;
import pl.motobudzet.api.infrastructure.mailing.EmailManagerFacade;

@Configuration
@AllArgsConstructor
public class AdvertisementFacadeConfiguration {
    private final AdvertisementRepository advertisementRepository;
    @Bean
    AdvertisementFacade advertisementFacade(EmailManagerFacade emailManagerFacade, FileManagerFacade fileManagerFacade, LocationFacade locationFacade, BrandFacade brandFacade, ModelFacade modelFacade) {
        AdvertisementService advertisementService = new AdvertisementService(advertisementRepository,emailManagerFacade,fileManagerFacade,locationFacade,brandFacade,modelFacade);
        AdvertisementFilteringService advertisementFilteringService = new AdvertisementFilteringService(advertisementRepository,brandFacade,modelFacade,locationFacade);
        return new AdvertisementFacade(advertisementService,advertisementFilteringService);
    }
}
