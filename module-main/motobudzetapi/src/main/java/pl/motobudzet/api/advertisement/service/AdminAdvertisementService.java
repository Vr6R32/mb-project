package pl.motobudzet.api.advertisement.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.advertisement.entity.Advertisement;
import pl.motobudzet.api.advertisement.repository.AdvertisementRepository;
import pl.motobudzet.api.emailSender.SpringMailSenderService;
import pl.motobudzet.api.user_account.entity.AppUser;

import java.util.UUID;

import static pl.motobudzet.api.advertisement.service.utils.SpecificationFilterHelper.getPage;


@Service
@RequiredArgsConstructor
public class AdminAdvertisementService {

    public static final int PAGE_SIZE = 12;
    private final AdvertisementRepository advertisementRepository;
    private final UserAdvertisementService userAdvertisementService;
    private final SpringMailSenderService mailSenderService;


    public Page<AdvertisementDTO> findAllAdvertisementsToVerify(Integer pageNumber) {
        return advertisementRepository.findAllToEnableAndVerify(PageRequest.of(getPage(pageNumber), PAGE_SIZE))
                .map(advertisement -> userAdvertisementService.mapToAdvertisementDTO(advertisement, false));
    }

    public String verifyAndEnableAdvertisement(UUID id) {

        Advertisement advertisement = userAdvertisementService.getAdvertisement(id);
        AppUser advertisementOwner = advertisement.getUser();

        advertisement.setVerified(true);
        advertisement.setActive(true);
        advertisementRepository.save(advertisement);

        mailSenderService.sendAdvertisementActivationConfirmNotification(advertisementOwner,advertisement);
        return "verified !";
    }
}
