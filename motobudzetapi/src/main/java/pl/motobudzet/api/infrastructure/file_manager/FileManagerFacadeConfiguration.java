package pl.motobudzet.api.infrastructure.file_manager;

import jakarta.persistence.EntityManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import pl.motobudzet.api.adapter.facade.AdvertisementFacade;

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
        FileService fileService = new FileService(advertisementFacade,pathsConfig,entityManager);
        return new FileManagerFacade(fileService);
    }

}
