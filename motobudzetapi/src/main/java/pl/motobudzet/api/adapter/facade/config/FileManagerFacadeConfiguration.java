package pl.motobudzet.api.adapter.facade.config;

import jakarta.persistence.EntityManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import pl.motobudzet.api.adapter.facade.AdvertisementFacade;
import pl.motobudzet.api.adapter.facade.FileManagerFacade;
import pl.motobudzet.api.infrastructure.configuration.PathsConfig;
import pl.motobudzet.api.infrastructure.file_manager.FactoryFileService;
import pl.motobudzet.api.infrastructure.file_manager.FileService;

@Configuration
public class FileManagerFacadeConfiguration {

    private final AdvertisementFacade advertisementFacade;
    private final PathsConfig pathsConfig;
    private final EntityManager entityManager;

    public FileManagerFacadeConfiguration(@Lazy AdvertisementFacade advertisementFacade, PathsConfig pathsConfig, EntityManager entityManager) {
        this.advertisementFacade = advertisementFacade;
        this.pathsConfig = pathsConfig;
        this.entityManager = entityManager;
    }

    @Bean
    FileManagerFacade fileManagerFacade() {
        FileService fileServiceImpl = FactoryFileService.createFileService(advertisementFacade, pathsConfig, entityManager);
        return new FileManagerFacade(fileServiceImpl);
    }

}
