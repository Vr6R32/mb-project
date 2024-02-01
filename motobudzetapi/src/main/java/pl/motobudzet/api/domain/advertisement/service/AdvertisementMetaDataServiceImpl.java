package pl.motobudzet.api.domain.advertisement.service;

import lombok.AllArgsConstructor;
import pl.motobudzet.api.infrastructure.thymeleaf.MetaDataDTO;
import pl.motobudzet.api.persistance.AdvertisementRepository;

import java.util.UUID;


@AllArgsConstructor
class AdvertisementMetaDataServiceImpl implements AdvertisementMetaDataService {

    private final AdvertisementRepository advertisementRepository;

    @Override
    public MetaDataDTO findMetaDataForAdvertisementById(UUID uuid) {
        return advertisementRepository.findMetaDataById(uuid).orElse(null);
    }
}
