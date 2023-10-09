package pl.motobudzet.api.advertisement.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.advertisement.entity.Advertisement;
import pl.motobudzet.api.advertisement.repository.AdvertisementRepository;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;


@Service
public class AdminAdvertisementService {

    public static final int PAGE_SIZE = 12;
    private final AdvertisementRepository advertisementRepository;

    private final PublicAdvertisementService publicAdvertisementService;

    public AdminAdvertisementService(AdvertisementRepository advertisementRepository, PublicAdvertisementService publicAdvertisementService) {
        this.advertisementRepository = advertisementRepository;
        this.publicAdvertisementService = publicAdvertisementService;
    }

    public Page<AdvertisementDTO> findAllAdvertisementsToVerify(Integer pageNumber) {
        return advertisementRepository.findAllToVerify(PageRequest.of(publicAdvertisementService.getPage(pageNumber), PAGE_SIZE))
                .map(advertisement -> publicAdvertisementService.mapToAdvertisementDTO(advertisement, false));
    }

    public String verifyAndEnableAdvertisement(String id) {
        Advertisement advertisement = publicAdvertisementService.getAdvertisement(id);
        advertisement.setVerified(true);
        advertisementRepository.save(advertisement);
        return "verified !";
    }

    public String deleteAdvertisement(String id) {
        // TODO usuwanie lokalnych image files jesli bysmy chcieli
        advertisementRepository.delete(publicAdvertisementService.getAdvertisement(id));
        return "deleted !";
    }
}
