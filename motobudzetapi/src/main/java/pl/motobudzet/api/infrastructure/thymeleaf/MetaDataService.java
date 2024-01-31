package pl.motobudzet.api.infrastructure.thymeleaf;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import pl.motobudzet.api.domain.advertisement.repository.AdvertisementRepository;

import java.util.UUID;


@RequiredArgsConstructor
@Component
public class MetaDataService {

    private final AdvertisementRepository advertisementRepository;

    public MetaDataDTO findMetaDataForAdvertisementById(UUID uuid) {
        return advertisementRepository.findMetaDataById(uuid).orElse(null);
    }
}
