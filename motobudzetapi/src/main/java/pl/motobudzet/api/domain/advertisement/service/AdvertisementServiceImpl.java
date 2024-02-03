package pl.motobudzet.api.domain.advertisement.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import pl.motobudzet.api.domain.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.domain.advertisement.dto.AdvertisementRequest;
import pl.motobudzet.api.domain.advertisement.entity.Advertisement;
import pl.motobudzet.api.domain.advertisement.model.Status;
import pl.motobudzet.api.domain.location.City;
import pl.motobudzet.api.persistance.AdvertisementRepository;
import pl.motobudzet.api.adapter.facade.LocationFacade;
import pl.motobudzet.api.infrastructure.file_manager.FileManagerFacade;
import pl.motobudzet.api.infrastructure.mailing.EmailManagerFacade;
import pl.motobudzet.api.domain.user.entity.AppUser;


import java.security.InvalidParameterException;
import java.util.*;

import static pl.motobudzet.api.infrastructure.mapper.AdvertisementMapper.*;


@Slf4j
@RequiredArgsConstructor
class AdvertisementServiceImpl implements AdvertisementService {

    public static final int PAGE_SIZE = 10;
    public static final Sort LAST_UPLOADED_SORT_PARAMS = Sort.by(Sort.Direction.DESC, "createDate");

    private final AdvertisementRepository advertisementRepository;
    private final EmailManagerFacade emailManagerFacade;
    private final FileManagerFacade fileManagerFacade;
    private final LocationFacade locationFacade;


    @Override
    public AdvertisementDTO findOneByIdWithFetch(UUID uuid) {
        return advertisementRepository.findOneByIdWithFetch(uuid)
                .map(advertisement -> mapToAdvertisementDTO(advertisement, true))
                .orElseThrow(() -> new RuntimeException("id doesn't exist!"));
    }

    @Override

    public List<AdvertisementDTO> getFewLastUploadedAdvertisements(Integer pageNumber, Integer pageSize) {

        Specification<Advertisement> specification = (root, query, criteriaBuilder) ->
                criteriaBuilder.and(criteriaBuilder.equal(root.get("status"), Status.ACTIVE));

        PageRequest pageable = PageRequest.of(FilteringHelper.getPage(pageNumber), pageSize, LAST_UPLOADED_SORT_PARAMS);
        Page<UUID> advertisementSpecificationIds = advertisementRepository.findAll(specification, pageable).map(Advertisement::getId);
        List<UUID> uuidList = advertisementSpecificationIds.getContent();

        return advertisementRepository.findByListOfUUIDs(uuidList)
                .stream().map(advertisement -> mapToAdvertisementDTO(advertisement, false)).toList();
    }

    @Override
    @Transactional
    public ResponseEntity<String> createAdvertisement(AdvertisementRequest request, AppUser user, List<MultipartFile> files) {
        log.info("[ADVERTISEMENT-SERVICE] -> CREATE NEW ADVERTISEMENT BY {}", user);
        Advertisement advertisement = mapCreateAdvertisementRequestToEntity(request, user);
        City city = locationFacade.getCityByNameAndState(request.getCity(), request.getCityState());
        advertisement.setCity(city);
        advertisement.setMainPhotoUrl(request.getMainPhotoUrl());
        UUID advertisementId = advertisementRepository.saveAndFlush(advertisement).getId();
        fileManagerFacade.verifySortAndSaveImages(advertisementId, files);
        String redirectUrl = "/advertisement?id=" + advertisement.getId();
        emailManagerFacade.sendEmailNotificationToManagement(advertisementId);
        return ResponseEntity.ok().header("location", redirectUrl).header("created", "true").body("inserted !");
    }

    @Override
    @Transactional
    public ResponseEntity<String> editAdvertisement(UUID advertisementId, AdvertisementRequest request, String loggedUser, List<MultipartFile> files) {

        Advertisement advertisement = getAdvertisement(advertisementId);

        if (advertisement.getUser().getUsername().equals(loggedUser)) {
            setAdvertisementByEditRequest(request, advertisement);
            String mainPhotoUrl = fileManagerFacade.verifySortAndSaveImages(advertisementId, files);
            City city = locationFacade.getCityByNameAndState(request.getCity(), request.getCityState());

            advertisement.setMainPhotoUrl(mainPhotoUrl);
            advertisement.setCity(city);
            advertisementRepository.save(advertisement);

            String redirectUrl = "/advertisement?id=" + advertisementId;

            emailManagerFacade.sendEmailNotificationToManagement(advertisementId);
            return ResponseEntity.ok().header("location", redirectUrl).header("edited", "true").body("inserted !");
        }
        return ResponseEntity.badRequest().body("not inserted");
    }

    @Override
    public List<AdvertisementDTO> findAllAdvertisementsToVerify(Integer pageNumber) {
        PageRequest pageable = PageRequest.of(FilteringHelper.getPage(pageNumber), PAGE_SIZE);
        List<UUID> uuidList = advertisementRepository.getListOfUUIDsToEnable(Status.PENDING_VERIFICATION, pageable);
        List<Advertisement> advertisementsList = advertisementRepository.findByListOfUUIDs(uuidList);

        return advertisementsList.stream().map(advertisement -> mapToAdvertisementDTO(advertisement, false)).toList();
    }

    @Override
    public String verifyAndEnableAdvertisement(UUID id) {
        Advertisement advertisement = getAdvertisement(id);
        AppUser advertisementOwner = advertisement.getUser();
        advertisement.setStatus(Status.ACTIVE);
        advertisementRepository.save(advertisement);
        emailManagerFacade.sendAdvertisementActivationConfirmNotification(advertisementOwner, advertisement);
        return "verified !";
    }


    @Override
    public Advertisement getAdvertisement(UUID advertisementId) {
        return advertisementRepository.findOneByIdWithFetch(advertisementId).orElseThrow(() -> new InvalidParameterException("wrong advertisement"));
    }

    @Override
    public List<AdvertisementDTO> getAllUserAdvertisements(AppUser loggedUser) {
        return advertisementRepository.getAllUserAdvertisementsByUserId(loggedUser.getId())
                .stream().map(advertisement -> mapToAdvertisementDTO(advertisement, true)).toList();
    }

    @Override
    @Transactional
    public int deleteUserAdvertisement(UUID id, String loggedUser) {
        boolean isOwner = advertisementRepository.checkAdvertisementOwnerByUserName(id, loggedUser);
        if(isOwner){
            return advertisementRepository.updateAdvertisementIsDeleted(id);
        }
        return 0;
    }

    @Override
    public int rejectAdvertisement(UUID id) {
        return advertisementRepository.updateAdvertisementIsRejected(id);
    }

}
