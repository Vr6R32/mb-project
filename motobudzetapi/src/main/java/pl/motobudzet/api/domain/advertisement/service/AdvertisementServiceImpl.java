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
import pl.motobudzet.api.persistance.AdvertisementRepository;
import pl.motobudzet.api.adapter.facade.BrandFacade;
import pl.motobudzet.api.adapter.facade.LocationFacade;
import pl.motobudzet.api.adapter.facade.ModelFacade;
import pl.motobudzet.api.infrastructure.file_manager.FileManagerFacade;
import pl.motobudzet.api.infrastructure.mailing.EmailManagerFacade;
import pl.motobudzet.api.domain.user.entity.AppUser;


import java.security.InvalidParameterException;
import java.util.*;

import static pl.motobudzet.api.infrastructure.mapper.AdvertisementMapper.mapToAdvertisementDTO;


@Slf4j
@RequiredArgsConstructor
class AdvertisementServiceImpl implements AdvertisementService {

    public static final int PAGE_SIZE = 10;
    public static final Sort LAST_UPLOADED_SORT_PARAMS = Sort.by(Sort.Direction.DESC, "createDate");

    private final AdvertisementRepository advertisementRepository;
    private final EmailManagerFacade emailManagerFacade;
    private final FileManagerFacade fileManagerFacade;
    private final LocationFacade locationFacade;
    private final BrandFacade brandFacade;
    private final ModelFacade modelFacade;


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
        UUID advertisementId = advertisementRepository.saveAndFlush(advertisement).getId();
        fileManagerFacade.verifySortAndSaveImages(advertisementId, files);
        String redirectUrl = "/advertisement?id=" + advertisement.getId();
        emailManagerFacade.sendEmailNotificationToManagement(advertisementId);
        return ResponseEntity.ok().header("location", redirectUrl).header("created", "true").body("inserted !");
    }

    @Override
    public ResponseEntity<String> editAdvertisement(UUID advertisementId, AdvertisementRequest request, String loggedUser, List<MultipartFile> files) {

        Advertisement advertisement = getAdvertisement(advertisementId);

        if (advertisement.getUser().getUsername().equals(loggedUser)) {
            setAdvertisementByEditRequest(request, advertisement);
            String mainPhotoUrl = fileManagerFacade.verifySortAndSaveImages(advertisementId, files);

            advertisement.setMainPhotoUrl(mainPhotoUrl);
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

    private Advertisement mapCreateAdvertisementRequestToEntity(AdvertisementRequest request, AppUser currentUser) {
        return Advertisement.builder()
                .name(request.getName())
                .description(request.getDescription())
                .model(modelFacade.getModelByNameAndBrandName(request.getModel(), request.getBrand()))
                .brand(brandFacade.getBrand(request.getBrand()))
                .fuelType(request.getFuelType())
                .driveType(request.getDriveType())
                .engineType(request.getEngineType())
                .transmissionType(request.getTransmissionType())
                .mileage(request.getMileage())
                .mileageUnit(request.getMileageUnit())
                .price(request.getPrice())
                .priceUnit(request.getPriceUnit())
                .engineCapacity(request.getEngineCapacity())
                .engineHorsePower(request.getEngineHorsePower())
                .firstRegistrationDate(request.getFirstRegistrationDate())
                .productionDate(request.getProductionDate())
                .city(locationFacade.getCityByNameAndState(request.getCity(), request.getCityState()))
                .user(currentUser)
                .imageUrls(new ArrayList<>())
                .status(Status.PENDING_VERIFICATION)
                .mainPhotoUrl(request.getMainPhotoUrl())
                .build();
    }

    private void setAdvertisementByEditRequest(AdvertisementRequest request, Advertisement advertisement) {
        advertisement.setName(request.getName());
        advertisement.setDescription(request.getDescription());
        advertisement.setModel(modelFacade.getModelByNameAndBrandName(request.getModel(), request.getBrand()));
        advertisement.setBrand(brandFacade.getBrand(request.getBrand()));
        advertisement.setFuelType(request.getFuelType());
        advertisement.setDriveType(request.getDriveType());
        advertisement.setEngineType(request.getEngineType());
        advertisement.setTransmissionType(request.getTransmissionType());
        advertisement.setMileage(request.getMileage());
        advertisement.setMileageUnit(request.getMileageUnit());
        advertisement.setPrice(request.getPrice());
        advertisement.setPriceUnit(request.getPriceUnit());
        advertisement.setEngineCapacity(request.getEngineCapacity());
        advertisement.setEngineHorsePower(request.getEngineHorsePower());
        advertisement.setFirstRegistrationDate(request.getFirstRegistrationDate());
        advertisement.setProductionDate(request.getProductionDate());
        advertisement.setCity(locationFacade.getCityByNameAndState(request.getCity(), request.getCityState()));
        advertisement.setStatus(Status.PENDING_VERIFICATION);
    }
}
