package pl.motobudzet.api.domain.advertisement.service;


import pl.motobudzet.api.infrastructure.thymeleaf.MetaDataDTO;
import java.util.UUID;

public interface AdvertisementMetaDataService {

    MetaDataDTO findMetaDataForAdvertisementById(UUID uuid);
}