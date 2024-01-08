package pl.motobudzet.api.advertisement.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.motobudzet.api.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.advertisement.dto.AdvertisementRequest;
import pl.motobudzet.api.advertisement.entity.Advertisement;
import pl.motobudzet.api.advertisement.model.MileageUnit;
import pl.motobudzet.api.advertisement.model.PriceUnit;
import pl.motobudzet.api.advertisement.repository.AdvertisementRepository;
import pl.motobudzet.api.emailSender.SpringMailSenderService;
import pl.motobudzet.api.fileManager.FileService;
import pl.motobudzet.api.location_city.CityService;
import pl.motobudzet.api.user_account.entity.AppUser;
import pl.motobudzet.api.user_account.service.AppUserCustomService;
import pl.motobudzet.api.user_account.service.UserDetailsService;
import pl.motobudzet.api.vehicleBrand.BrandService;
import pl.motobudzet.api.vehicleModel.ModelService;
import pl.motobudzet.api.vehicleSpec.service.SpecificationService;

import java.security.InvalidParameterException;
import java.util.*;
import java.util.stream.Collectors;

import static pl.motobudzet.api.advertisement.service.FilteringHelper.getPage;
import static pl.motobudzet.api.mappers.AdvertisementMapper.mapToAdvertisementDTO;


@Service
@Slf4j
@RequiredArgsConstructor
public class AdvertisementService {

    public static final int PAGE_SIZE = 10;
    public static final Sort LAST_UPLOADED_SORT_PARAMS = Sort.by(Sort.Direction.DESC, "createDate");

    private final AdvertisementRepository advertisementRepository;
    private final SpecificationService specificationService;
    private final BrandService brandService;
    private final ModelService modelService;
    private final AppUserCustomService userCustomService;
    private final UserDetailsService userDetailsService;
    private final SpringMailSenderService mailSenderService;
    private final CityService cityService;
    private final FileService fileService;


    public AdvertisementDTO findOneByIdWithFetch(UUID uuid) {
        return advertisementRepository.findOneByIdWithFetch(uuid)
                .map(advertisement -> mapToAdvertisementDTO(advertisement, true))
                .orElseThrow(() -> new RuntimeException("id doesn't exist!"));
    }

    public List<AdvertisementDTO> findLastUploaded(Integer pageNumber, Integer pageSize) {

        Specification<Advertisement> specification = (root, query, criteriaBuilder) ->
                criteriaBuilder.and(
                        criteriaBuilder.isTrue(root.get("isVerified")),
                        criteriaBuilder.isTrue(root.get("isActive")),
                        criteriaBuilder.isFalse(root.get("isDeleted"))
                );

        PageRequest pageable = PageRequest.of(getPage(pageNumber), pageSize, LAST_UPLOADED_SORT_PARAMS);
        Page<UUID> advertisementSpecificationIds = advertisementRepository.findAll(specification, pageable).map(Advertisement::getId);
        List<UUID> uuidList = advertisementSpecificationIds.getContent();
        List<Advertisement> fetchedAdvertisementDetails = advertisementRepository.findByListOfUUIDs(uuidList);
        List<Advertisement> advertisementDetails = uuidList.stream()
                .map(uuid -> fetchedAdvertisementDetails.stream()
                        .filter(adv -> adv.getId().equals(uuid))
                        .findFirst()
                        .orElse(null))
                .filter(Objects::nonNull)
                .toList();

        return advertisementDetails.stream()
                .map(advertisement -> mapToAdvertisementDTO(advertisement, false)).collect(Collectors.toList());
    }

    @Transactional
    public ResponseEntity<String> createNewAdvertisement(AdvertisementRequest request, String user, List<MultipartFile> files) {

        log.info("[ADVERTISEMENT-SERVICE] -> CREATE NEW ADVERTISEMENT BY {}", user);

        AppUser currentUser = userCustomService.getUserByName(user);
        Advertisement advertisement = Advertisement.builder()
                .name(request.getName())
                .description(request.getDescription())
                .model(modelService.getModelByBrand(request.getModel(), request.getBrand()))
                .brand(brandService.getBrand(request.getBrand()))
                .fuelType(specificationService.getFuelType(request.getFuelType()))
                .driveType(specificationService.getDriveType(request.getDriveType()))
                .engineType(specificationService.getEngineType(request.getEngineType()))
                .transmissionType(specificationService.getTransmissionType(request.getTransmissionType()))
                .mileage(request.getMileage())
                .mileageUnit(MileageUnit.valueOf(request.getMileageUnit()))
                .price(request.getPrice())
                .priceUnit(PriceUnit.valueOf(request.getPriceUnit()))
                .engineCapacity(request.getEngineCapacity())
                .engineHorsePower(request.getEngineHorsePower())
                .firstRegistrationDate(request.getFirstRegistrationDate())
                .productionDate(request.getProductionDate())
                .city(cityService.getCityByNameAndState(request.getCity(), request.getCityState()))
                .user(currentUser)
                .imageUrls(new ArrayList<>())
                .isVerified(false)
                .isActive(false)
                .isDeleted(false)
                .mainPhotoUrl(request.getMainPhotoUrl())
                .build();

        assignAdvertisementToUser(advertisement, currentUser);


        UUID advertisementId = advertisementRepository.saveAndFlush(advertisement).getId();
        fileService.verifySortAndSaveImages(advertisementId, files);
        String redirectUrl = "/advertisement?id=" + advertisement.getId();
        sendEmailNotificationToManagement(advertisementId);
        return ResponseEntity.ok().header("location", redirectUrl).header("created", "true").header("edited", "true").body("inserted !");
    }

    private void assignAdvertisementToUser(Advertisement advertisement, AppUser user) {
        if (user.getAdvertisements() == null) {
            user.setAdvertisements(Set.of(advertisement));
        } else {
            Set<Advertisement> advertisements = user.getAdvertisements();
            advertisements.add(advertisement);
            advertisement.setUser(user);
        }
    }

    public ResponseEntity<String> editExistingAdvertisement(UUID advertisementId, AdvertisementRequest request, String loggedUser, List<MultipartFile> files) {

        Advertisement advertisement = getAdvertisement(advertisementId);


        if (advertisement.getUser().getUsername().equals(loggedUser)) {
            advertisement.setName(request.getName());
            advertisement.setDescription(request.getDescription());
            advertisement.setModel(modelService.getModelByBrand(request.getModel(), request.getBrand()));
            advertisement.setBrand(brandService.getBrand(request.getBrand()));
            advertisement.setFuelType(specificationService.getFuelType(request.getFuelType()));
            advertisement.setDriveType(specificationService.getDriveType(request.getDriveType()));
            advertisement.setEngineType(specificationService.getEngineType(request.getEngineType()));
            advertisement.setTransmissionType(specificationService.getTransmissionType(request.getTransmissionType()));
            advertisement.setMileage(request.getMileage());
            advertisement.setMileageUnit(MileageUnit.valueOf(request.getMileageUnit()));
            advertisement.setPrice(request.getPrice());
            advertisement.setPriceUnit(PriceUnit.valueOf(request.getPriceUnit()));
            advertisement.setEngineCapacity(request.getEngineCapacity());
            advertisement.setEngineHorsePower(request.getEngineHorsePower());
            advertisement.setFirstRegistrationDate(request.getFirstRegistrationDate());
            advertisement.setProductionDate(request.getProductionDate());
            advertisement.setCity(cityService.getCityByNameAndState(request.getCity(), request.getCityState()));
            advertisement.setVerified(false);


            String mainPhotoUrl = fileService.verifySortAndSaveImages(advertisementId, files);

            advertisement.setMainPhotoUrl(mainPhotoUrl);
            advertisementRepository.save(advertisement);

            String redirectUrl = "/advertisement?id=" + advertisement.getId();

            sendEmailNotificationToManagement(advertisement.getId());
            return ResponseEntity.ok().header("location", redirectUrl).header("created", "true").header("edited", "true").body("inserted !");
        }
        return ResponseEntity.badRequest().body("not inserted");
    }

    private void sendEmailNotificationToManagement(UUID id) {
        List<String> emailList = userDetailsService.findManagementEmails();
        mailSenderService.sendEmailNotificationToManagement(emailList, id);
    }


    public List<AdvertisementDTO> findAllAdvertisementsToVerify(Integer pageNumber) {
        List<UUID> uuidList = advertisementRepository.getListOfUUIDsToEnable(PageRequest.of(getPage(pageNumber), PAGE_SIZE));
        List<Advertisement> advertisementsList = advertisementRepository.findByListOfUUIDs(uuidList);

        return advertisementsList.stream().map(advertisement -> mapToAdvertisementDTO(advertisement, false)).toList();
    }

    public String verifyAndEnableAdvertisement(UUID id) {

        Advertisement advertisement = getAdvertisement(id);
        AppUser advertisementOwner = advertisement.getUser();

        advertisement.setVerified(true);
        advertisement.setActive(true);
        advertisementRepository.save(advertisement);

        mailSenderService.sendAdvertisementActivationConfirmNotification(advertisementOwner, advertisement);
        return "verified !";
    }


    public Advertisement getAdvertisement(UUID advertisementId) {
        return advertisementRepository.findOneByIdWithFetch(advertisementId).orElseThrow(() -> new InvalidParameterException("wrong advertisement"));
    }


    public List<AdvertisementDTO> getAllUserAdvertisements(String loggedUser) {
        Long userNameId = userCustomService.getUserIdByUserName(loggedUser);
        return advertisementRepository.getAllUserAdvertisementsByUserId(userNameId)
                .stream().map(advertisement -> mapToAdvertisementDTO(advertisement, true)).toList();

    }

    @Transactional
    public int deleteUserAdvertisement(UUID id, String username) {
        AppUser user = userCustomService.getUserByName(username);
        if (username.equals(user.getUsername())) {
            return advertisementRepository.updateAdvertisementIsDeleted(id);
        }
        return 0;
    }

    public String rejectAdvertisement(UUID id) {
        return "Odrzucono ogłoszenie";
    }
}
