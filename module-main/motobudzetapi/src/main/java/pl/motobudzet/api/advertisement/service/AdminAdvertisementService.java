package pl.motobudzet.api.advertisement.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.advertisement.entity.Advertisement;
import pl.motobudzet.api.advertisement.repository.AdvertisementRepository;
import pl.motobudzet.api.user.repository.AppUserRepository;


@Service
@RequiredArgsConstructor
public class AdminAdvertisementService {

    public static final int PAGE_SIZE = 12;
    private final AdvertisementRepository advertisementRepository;
    private final AppUserRepository userRepository;
    private final PublicAdvertisementService publicAdvertisementService;



    public Page<AdvertisementDTO> findAllAdvertisementsToVerify(Integer pageNumber) {
        return advertisementRepository.findAllToEnableAndVerify(PageRequest.of(publicAdvertisementService.getPage(pageNumber), PAGE_SIZE))
                .map(advertisement -> publicAdvertisementService.mapToAdvertisementDTO(advertisement, false));
    }

    public String verifyAndEnableAdvertisement(String id) {
        Advertisement advertisement = publicAdvertisementService.getAdvertisement(id);
        advertisement.setVerified(true);
        advertisement.setActive(true);
        advertisementRepository.save(advertisement);
        return "verified !";
    }

    public String deleteAdvertisement(String id) {
        Advertisement advertisement = publicAdvertisementService.getAdvertisement(id);
//        AppUser user = advertisement.getUser();
//        user.getAdvertisements().remove(advertisement);
//        userRepository.save(user);
        advertisementRepository.delete(advertisement);
        return "deleted !";
    }
}
