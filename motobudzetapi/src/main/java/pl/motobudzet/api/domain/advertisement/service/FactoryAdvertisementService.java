package pl.motobudzet.api.domain.advertisement.service;

import pl.motobudzet.api.adapter.facade.BrandFacade;
import pl.motobudzet.api.adapter.facade.LocationFacade;
import pl.motobudzet.api.adapter.facade.ModelFacade;
import pl.motobudzet.api.infrastructure.file_manager.FileManagerFacade;
import pl.motobudzet.api.infrastructure.mailing.EmailManagerFacade;
import pl.motobudzet.api.persistance.AdvertisementRepository;

public class FactoryAdvertisementService {


    private FactoryAdvertisementService() {
    }

    public static AdvertisementFilteringService createFilteringService(AdvertisementRepository advertisementRepository, BrandFacade brandFacade, ModelFacade modelFacade, LocationFacade locationFacade) {
        return new AdvertisementFilteringServiceImpl(advertisementRepository,brandFacade,modelFacade,locationFacade);
    }

    public static AdvertisementService createService(AdvertisementRepository advertisementRepository, EmailManagerFacade emailManagerFacade, FileManagerFacade fileManagerFacade, LocationFacade locationFacade) {
        return new AdvertisementServiceImpl(advertisementRepository,emailManagerFacade,fileManagerFacade,locationFacade);
    }

    public static AdvertisementMetaDataService createMetaDataService(AdvertisementRepository advertisementRepository){
        return new AdvertisementMetaDataServiceImpl(advertisementRepository);
    }

}