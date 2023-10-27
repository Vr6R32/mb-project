package pl.motobudzet.api.advertisement.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.advertisement.dto.AdvertisementCreateRequest;
import pl.motobudzet.api.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.advertisement.entity.Advertisement;
import pl.motobudzet.api.advertisement.model.MileageUnit;
import pl.motobudzet.api.advertisement.model.PriceUnit;
import pl.motobudzet.api.advertisement.repository.AdvertisementRepository;
import pl.motobudzet.api.locationCity.service.CityService;
import pl.motobudzet.api.locationState.service.CityStateService;
import pl.motobudzet.api.user.entity.AppUser;
import pl.motobudzet.api.user.service.AppUserCustomService;
import pl.motobudzet.api.utils.MessageDateTimeExtractor;
import pl.motobudzet.api.vehicleBrand.service.BrandService;
import pl.motobudzet.api.vehicleModel.service.ModelService;
import pl.motobudzet.api.vehicleSpec.service.SpecificationService;

import java.security.InvalidParameterException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class PublicAdvertisementService {

    public static final int PAGE_SIZE = 10;
    public static final Sort LAST_UPLOADED_SORT_PARAMS = Sort.by(Sort.Direction.DESC, "creationTime");
    private final AdvertisementRepository advertisementRepository;
    private final SpecificationService specificationService;
    private final BrandService brandService;
    private final ModelService modelService;
    private final AppUserCustomService userCustomService;
    private final CityService cityService;
    private final CityStateService cityStateService;
    private final EntityManager entityManager;

    public List<AdvertisementDTO> getAllUserFavouritesAdvertisements(String username, String loggedUser, List<String> uuidStringList) {
        System.out.println(uuidStringList);
        if (username.equals(loggedUser)) {
            List<UUID> uuidsList = uuidStringList.stream().map(UUID::fromString).toList();
            return advertisementRepository.getAllAdvertisementsByListOfIds(uuidsList).stream()
                    .map(advertisement -> mapToAdvertisementDTO(advertisement, false)).toList();
        }
        return Collections.emptyList();
    }

    public AdvertisementDTO findOneByIdWithFetch(UUID uuid) {
        return advertisementRepository.findOneByIdWithFetch(uuid)
                .map(advertisement -> mapToAdvertisementDTO(advertisement, true))
                .orElseThrow(() -> new RuntimeException("id doesn't exist!"));
    }

    public List<AdvertisementDTO> findLastUploaded(Integer pageNumber, Integer pageSize) {


//        String jpql =
//                "SELECT a FROM Advertisement a " +
//                "LEFT JOIN FETCH a.imageUrls " +
//                "LEFT JOIN FETCH a.brand b " +
//                "LEFT JOIN FETCH a.model m " +
//                "LEFT JOIN FETCH a.driveType d " +
//                "LEFT JOIN FETCH a.engineType e " +
//                "LEFT JOIN FETCH a.fuelType f " +
//                "LEFT JOIN FETCH a.user u " +
//                "LEFT JOIN FETCH a.transmissionType t " +
//                "left join fetch a.city ac " +
//                "left join fetch ac.cityState acs " +
//                "where a.isVerified = true";
//        TypedQuery<Advertisement> query = entityManager.createQuery(jpql, Advertisement.class);
//        query.setMaxResults(12);
//        return query.getResultList().stream().map(advertisement -> mapToAdvertisementDTO(advertisement,false)).toList();

        Specification<Advertisement> isVerifiedSpecification = (root, query, cb) -> cb.equal(root.get("isVerified"), true);
        Specification<Advertisement> specification = Specification.where(isVerifiedSpecification);

        PageRequest pageable = PageRequest.of(getPage(pageNumber), pageSize, LAST_UPLOADED_SORT_PARAMS);
        Page<UUID> advertisementSpecificationIds = advertisementRepository.findAll(specification, pageable).map(Advertisement::getId);
        List<UUID> uuidList = advertisementSpecificationIds.getContent();
        List<Advertisement> fetchedAdvertisementDetails = advertisementRepository.findAllCustomByUUIDs(uuidList);
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

    //    @CachePut(cacheNames = "advertisements_filter_cache")
    @CacheEvict(cacheNames = "advertisements_filter_cache")
    public ResponseEntity<String> createNewAdvertisement(AdvertisementCreateRequest request, String user) {


        AppUser currentUser = userCustomService.getByName(user);


        Advertisement advertisement = Advertisement.builder()

                .name(request.getName())
                .description(request.getDescription())
                .model(modelService.getModel(request.getModel()))
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
                .creationTime(LocalDateTime.now(ZoneId.of("Europe/Warsaw")))
                .city(cityService.getCityByNameAndState(request.getCity(),request.getCityState()))
                .user(currentUser)
                .isVerified(false)
                .build();


        insertAdvertisementIntoUser(advertisement, currentUser);

        advertisementRepository.saveAndFlush(advertisement);

        String id = advertisement.getId().toString();

        return ResponseEntity.ok().header("advertisementId", id).body("inserted !");
    }

    private void insertAdvertisementIntoUser(Advertisement advertisement, AppUser user) {
        if (user.getAdvertisements() == null) {
            user.setAdvertisements(Set.of(advertisement));
        } else {
            Set<Advertisement> advertisements = user.getAdvertisements();
            advertisements.add(advertisement);
            advertisement.setUser(user);
        }
    }

    public ResponseEntity<String> editExistingAdvertisement(String advertisementId, AdvertisementCreateRequest request, String loggedUser) {

        Advertisement advertisement = getAdvertisement(advertisementId);

        if (advertisement.getUser().getUsername().equals(loggedUser)) {

            advertisement.setName(request.getName());
            advertisement.setDescription(request.getDescription());
            advertisement.setModel(modelService.getModel(request.getModel()));
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

            advertisementRepository.save(advertisement);


            String id = advertisement.getId().toString();
            return ResponseEntity.ok().header("advertisementId", id).body("inserted !");
        }
        return ResponseEntity.badRequest().body("not inserted");
    }

    public AdvertisementDTO mapToAdvertisementDTO(Advertisement adv, boolean includeImageUrls) {

        LocalDateTime advCreationTime = adv.getCreationTime();

        String creationDate = MessageDateTimeExtractor.extractDate(advCreationTime);
        String creationTime = MessageDateTimeExtractor.extractTime(advCreationTime);

        AdvertisementDTO builder = AdvertisementDTO.builder()
                .id(adv.getId().toString())
                .name(adv.getName())
                .description(adv.getDescription())
//                .model(modelService.getModel(adv.getModel().getId()))
//                .brand(brandService.getBrand(adv.getBrand().getId()))
//                .fuelType(specificationService.getFuelType(adv.getFuelType().getId()))
//                .driveType(specificationService.getDriveType(adv.getDriveType().getId()))
//                .engineType(specificationService.getEngineType(adv.getEngineType().getId()))
//                .transmissionType(specificationService.getTransmissionType(adv.getTransmissionType().getId()))
//                .city(cityService.getCityById(adv.getCity().getId()).getName())
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
                .mileageUnit(String.valueOf(adv.getMileageUnit()))
                .price(adv.getPrice())
                .priceUnit(String.valueOf(adv.getPriceUnit()))
                .engineCapacity(adv.getEngineCapacity())
                .engineHorsePower(adv.getEngineHorsePower())
                .firstRegistrationDate(adv.getFirstRegistrationDate())
                .productionDate(adv.getProductionDate())
                .creationDate(creationDate)
//                .city(cityService.getCityByName(adv.getCity().getName()).getName())

//                .cityState(cityStateService.findCityStateByName(adv.getCity().getCityState().getName()))
//                .city(cityService.getCityByAjdi(adv.getCity().getId()).getName())
//                .cityState(cityStateService.findCityStateByAjdi(cityService.getCityByAjdi(adv.getCity().getId()).getCityState().getId()).getName())
                .mainPhotoUrl(adv.getMainPhotoUrl())
                .build();

        if (includeImageUrls) {
            builder.setUrlList(adv.getImageUrls());
        }

        return builder;
    }

    public Advertisement getAdvertisement(String advertisementId) {
        return advertisementRepository.findByAjdi(UUID.fromString(advertisementId)).orElseThrow(() -> new InvalidParameterException("wrong advertisement"));
    }

    public int getPage(Integer pageNumber) {
        if (pageNumber == null) {
            pageNumber = 0;
        }
        return Math.max(pageNumber, 0);
    }

    public List<AdvertisementDTO> getAllUserAdvertisements(String username, String loggedUser) {
        if (username.equals(loggedUser)) {
            Long userNameId = userCustomService.getUserIdByUserName(username);
            return advertisementRepository.findAllAdvertisementsByUserId(userNameId)
                    .stream().map(advertisement -> mapToAdvertisementDTO(advertisement, true)).toList();
        }
        return Collections.emptyList();
    }

    public void saveAdvertisement(Advertisement advertisement) {
        advertisementRepository.save(advertisement);
    }

    public int insertPhotoToAdvertisement(UUID id, String fileName) {
        return advertisementRepository.insertNewPhoto(id, fileName);
    }

    @Modifying
    @Transactional
    public int insertNewPhotos(UUID id, LinkedHashSet<String> names) {
        // First, delete the existing records associated with the advertisement_id
        Query deleteQuery = entityManager.createNativeQuery("DELETE FROM advertisement_images WHERE advertisement_id = ?");
        deleteQuery.setParameter(1, id);
        deleteQuery.executeUpdate();

        // Now proceed with inserting new records
        String baseQuery = "INSERT INTO advertisement_images (advertisement_id, image_urls) VALUES ";
        List<Object[]> params = new ArrayList<>();

        StringBuilder values = new StringBuilder();
        for (String name : names) {
            values.append("(?, ?),");
            params.add(new Object[]{id, name});
        }

        // Remove the last comma
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
}
