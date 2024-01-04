package pl.motobudzet.api.advertisement.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.motobudzet.api.advertisement.dto.AdvertisementRequest;
import pl.motobudzet.api.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.advertisement.entity.Advertisement;
import pl.motobudzet.api.advertisement.model.MileageUnit;
import pl.motobudzet.api.advertisement.model.PriceUnit;
import pl.motobudzet.api.advertisement.repository.AdvertisementRepository;
import pl.motobudzet.api.emailSender.SpringMailSenderService;
import pl.motobudzet.api.fileManager.FileService;
import pl.motobudzet.api.locationCity.CityService;
import pl.motobudzet.api.user_account.entity.AppUser;
import pl.motobudzet.api.user_account.service.AppUserCustomService;
import pl.motobudzet.api.user_account.service.UserDetailsService;
import pl.motobudzet.api.vehicleBrand.BrandService;
import pl.motobudzet.api.vehicleModel.ModelService;
import pl.motobudzet.api.vehicleSpec.service.SpecificationService;

import java.security.InvalidParameterException;
import java.util.*;
import java.util.stream.Collectors;

import static pl.motobudzet.api.advertisement.service.utils.SpecificationFilterHelper.getPage;


@Service
@Slf4j
@RequiredArgsConstructor
public class UserAdvertisementService {

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
    private final EntityManager entityManager;
    private final FileService fileService;

    public List<AdvertisementDTO> getAllUserFavouritesAdvertisements(List<String> uuidStringList) {
            List<UUID> uuidsList = uuidStringList.stream().map(UUID::fromString).toList();
            return advertisementRepository.getAllAdvertisementsByListOfIds(uuidsList).stream()
                    .map(advertisement -> mapToAdvertisementDTO(advertisement, false)).toList();
    }

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

        log.info("[ADVERTISEMENT-SERVICE] -> CREATE NEW ADVERTISEMENT BY {}",user);

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
        return ResponseEntity.ok().header("location", redirectUrl).header("created","true").header("edited","true").body("inserted !");
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
            advertisement.setModel(modelService.getModelByBrand(request.getModel(),request.getBrand()));
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
            advertisement.setCity(cityService.getCityByNameAndState(request.getCity(),request.getCityState()));
            advertisement.setVerified(false);


            String mainPhotoUrl = fileService.verifySortAndSaveImages(advertisementId, files);

            advertisement.setMainPhotoUrl(mainPhotoUrl);
            advertisementRepository.save(advertisement);

            String redirectUrl = "/advertisement?id=" + advertisement.getId();

            sendEmailNotificationToManagement(advertisement.getId());
            return ResponseEntity.ok().header("location", redirectUrl).header("created","true").header("edited","true").body("inserted !");
        }
        return ResponseEntity.badRequest().body("not inserted");
    }

    private void sendEmailNotificationToManagement(UUID id) {
        List<String> emailList = userDetailsService.findManagementEmails();
        mailSenderService.sendEmailNotificationToManagement(emailList,id);
    }

    public AdvertisementDTO mapToAdvertisementDTO(Advertisement adv, boolean includeImageUrls) {

        AdvertisementDTO builder = AdvertisementDTO.builder()
                .id(adv.getId().toString())
                .name(adv.getName())
                .description(adv.getDescription())
                .model(adv.getModel().getName())
                .brand(adv.getBrand().getName())
                .fuelType(adv.getFuelType().getName())
                .driveType(adv.getDriveType().getName())
                .engineType(adv.getEngineType().getName())
                .transmissionType(adv.getTransmissionType().getName())
                .user(adv.getUser().getUsername())
                .city(adv.getCity().getName())
                .cityState(adv.getCity().getCityState().getName())
                .mileage(adv.getMileage())
                .mileageUnit(adv.getMileageUnit())
                .price(adv.getPrice())
                .priceUnit(adv.getPriceUnit())
                .engineCapacity(adv.getEngineCapacity())
                .engineHorsePower(adv.getEngineHorsePower())
                .firstRegistrationDate(adv.getFirstRegistrationDate())
                .productionDate(adv.getProductionDate())
                .createDate(adv.getCreateDate().toLocalDate())
                .createTime(adv.getCreateDate().toLocalTime())
                .mainPhotoUrl(adv.getMainPhotoUrl())
                .isDeleted(adv.isDeleted())
                .isVerified(adv.isVerified())
                .isActive(adv.isActive())
                .build();

        if (includeImageUrls) {
            builder.setUrlList(adv.getImageUrls());
        }

        return builder;
    }

    public Advertisement getAdvertisement(UUID advertisementId) {
        return advertisementRepository.findByAjdi(advertisementId).orElseThrow(() -> new InvalidParameterException("wrong advertisement"));
    }



    public List<AdvertisementDTO> getAllUserAdvertisements(String username, String loggedUser) {
        if (username.equals(loggedUser)) {
            Long userNameId = userCustomService.getUserIdByUserName(username);
            return advertisementRepository.findAllAdvertisementsByUserId(userNameId)
                    .stream().map(advertisement -> mapToAdvertisementDTO(advertisement, true)).toList();
        }
        return Collections.emptyList();
    }

    @Modifying
    @Transactional
    public int insertNewPhotos(UUID id, LinkedHashSet<String> names) {

        Query deleteQuery = entityManager.createNativeQuery("DELETE FROM advertisement_images WHERE advertisement_id = ?");
        deleteQuery.setParameter(1, id);
        deleteQuery.executeUpdate();

        String baseQuery = "INSERT INTO advertisement_images (advertisement_id, image_urls) VALUES ";
        List<Object[]> params = new ArrayList<>();

        StringBuilder values = new StringBuilder();
        for (String name : names) {
            values.append("(?, ?),");
            params.add(new Object[]{id, name});
        }

        if (values.length() > 0) {
            values.setLength(values.length() - 1);
        }

        Query query = entityManager.createNativeQuery(baseQuery + values.toString());
        for (int i = 0; i < params.size(); i++) {
            Object[] paramSet = params.get(i);
            query.setParameter((i * 2) + 1, paramSet[0]);
            query.setParameter((i * 2) + 2, paramSet[1]);
        }

        return query.executeUpdate();
    }

    @Transactional
    public int deleteUserAdvertisement(UUID id, String username) {
        AppUser user = userCustomService.getUserByName(username);
        if(username.equals(user.getUsername())){
            return advertisementRepository.updateAdvertisementIsDeleted(id);
        }
        return 0;
    }
}
