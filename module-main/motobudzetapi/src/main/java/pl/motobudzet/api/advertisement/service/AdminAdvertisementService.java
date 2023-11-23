package pl.motobudzet.api.advertisement.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.advertisement.entity.Advertisement;
import pl.motobudzet.api.advertisement.repository.AdvertisementRepository;


@Service
@RequiredArgsConstructor
public class AdminAdvertisementService {

    public static final int PAGE_SIZE = 12;
    private final AdvertisementRepository advertisementRepository;
    private final UserAdvertisementService userAdvertisementService;


    public Page<AdvertisementDTO> findAllAdvertisementsToVerify(Integer pageNumber) {
        return advertisementRepository.findAllToEnableAndVerify(PageRequest.of(userAdvertisementService.getPage(pageNumber), PAGE_SIZE))
                .map(advertisement -> userAdvertisementService.mapToAdvertisementDTO(advertisement, false));
    }

    public String verifyAndEnableAdvertisement(String id) {
        Advertisement advertisement = userAdvertisementService.getAdvertisement(id);
        advertisement.setVerified(true);
        advertisement.setActive(true);
        advertisementRepository.save(advertisement);
        return "verified !";
    }
}
