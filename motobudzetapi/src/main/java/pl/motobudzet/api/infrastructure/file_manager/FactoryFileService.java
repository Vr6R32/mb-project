package pl.motobudzet.api.infrastructure.file_manager;


import jakarta.persistence.EntityManager;
import pl.motobudzet.api.adapter.facade.AdvertisementFacade;
import pl.motobudzet.api.infrastructure.configuration.PathsConfig;


public class FactoryFileService {

    private FactoryFileService() {
    }

    public static FileService createFileService(AdvertisementFacade advertisementFacade, PathsConfig pathsConfig, EntityManager entityManager) {
        return new FileServiceImpl(advertisementFacade, pathsConfig, entityManager);
    }
}
