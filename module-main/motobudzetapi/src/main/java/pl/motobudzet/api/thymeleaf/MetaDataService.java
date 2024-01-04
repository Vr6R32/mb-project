package pl.motobudzet.api.thymeleaf;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import pl.motobudzet.api.advertisement.repository.AdvertisementRepository;

import java.util.UUID;


@RequiredArgsConstructor
@Component
public class MetaDataService {

    private final AdvertisementRepository advertisementRepository;

    MetaDataDTO findMetaDataForAdvertisementById(UUID uuid) {
        return advertisementRepository.findMetaDataById(uuid).orElse(null);
    }
}
