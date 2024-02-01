package pl.motobudzet.api.adapter.facade.config;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pl.motobudzet.api.adapter.facade.AdvertisementFacade;
import pl.motobudzet.api.adapter.facade.BrandFacade;
import pl.motobudzet.api.adapter.facade.LocationFacade;
import pl.motobudzet.api.adapter.facade.ModelFacade;
import pl.motobudzet.api.domain.advertisement.service.*;
import pl.motobudzet.api.persistance.AdvertisementRepository;
import pl.motobudzet.api.infrastructure.file_manager.FileManagerFacade;
import pl.motobudzet.api.infrastructure.mailing.EmailManagerFacade;

@Configuration
@AllArgsConstructor
class AdvertisementFacadeConfiguration {

    private final AdvertisementRepository advertisementRepository;
    private final EmailManagerFacade emailManagerFacade;
    private final FileManagerFacade fileManagerFacade;
    private final LocationFacade locationFacade;
    private final BrandFacade brandFacade;
    private final ModelFacade modelFacade;

    @Bean
    public AdvertisementFacade advertisementFacade() {

        AdvertisementService advertisementService =
                FactoryAdvertisementService.createService(advertisementRepository,emailManagerFacade,fileManagerFacade,locationFacade);

        AdvertisementFilteringService advertisementFilteringService =
                FactoryAdvertisementService.createFilteringService(advertisementRepository,brandFacade,modelFacade,locationFacade);

        AdvertisementMetaDataService advertisementMetaDataService =
                FactoryAdvertisementService.createMetaDataService(advertisementRepository);

        return new AdvertisementFacade(advertisementService, advertisementFilteringService, advertisementMetaDataService);
    }
}
