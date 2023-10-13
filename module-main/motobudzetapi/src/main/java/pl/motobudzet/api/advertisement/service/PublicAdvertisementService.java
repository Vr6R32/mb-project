package pl.motobudzet.api.advertisement.service;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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
import java.util.Collections;
import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class PublicAdvertisementService {

    public static final int PAGE_SIZE = 3;
    public static final Sort LAST_UPLOADED_SORT_PARAMS = Sort.by(Sort.Direction.DESC, "creationTime");
    private final AdvertisementRepository advertisementRepository;
    private final SpecificationService specificationService;
    private final BrandService brandService;
    private final ModelService modelService;
    private final AppUserCustomService userCustomService;
    private final CityService cityService;
    private final CityStateService cityStateService;

    public List<AdvertisementDTO> getAllUserFavouritesAdvertisements(String username, String loggedUser, List<String> uuidStringList){
        if (username.equals(loggedUser)){
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

    public Page<AdvertisementDTO> findLastUploaded(Integer pageNumber, Integer pageSize) {
        int page = getPage(pageNumber);

        return advertisementRepository.findAllVerified(PageRequest.of(page, pageSize, LAST_UPLOADED_SORT_PARAMS))
                .map(advertisement -> mapToAdvertisementDTO(advertisement, false));
    }

    //    @CachePut(cacheNames = "advertisements_filter_cache")
    @CacheEvict(cacheNames = "advertisements_filter_cache")
    public ResponseEntity<String> createNewAdvertisement(AdvertisementCreateRequest request,String user) {


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
                .city(currentUser.getCity())
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
            user.setAdvertisements(List.of(advertisement));
        } else {
            List<Advertisement> advertisements = user.getAdvertisements();
            advertisements.add(advertisement);
        }
    }

    public String editExistingAdvertisement(String advertisementId, AdvertisementCreateRequest request) {

        Advertisement advertisement = getAdvertisement(advertisementId);

        advertisement.setBrand(brandService.getBrand(request.getBrand()));
        advertisement.setModel(modelService.getModel(request.getModel()));
        advertisement.setDescription(request.getDescription());
        advertisement.setName(request.getName());
        advertisement.setMileage(request.getMileage());
        advertisement.setFirstRegistrationDate(request.getFirstRegistrationDate());
        advertisement.setProductionDate(request.getProductionDate());
        advertisementRepository.save(advertisement);

        return "advertisement edited!";
    }

    public AdvertisementDTO mapToAdvertisementDTO(Advertisement adv, boolean includeUserAndUrls) {

        LocalDateTime advCreationTime = adv.getCreationTime();

        String creationDate = MessageDateTimeExtractor.extractDate(advCreationTime);
        String creationTime = MessageDateTimeExtractor.extractTime(advCreationTime);

        AdvertisementDTO builder = AdvertisementDTO.builder()
                .id(adv.getId().toString())
                .name(adv.getName())
                .description(adv.getDescription())
                .model(modelService.getModel(adv.getModel().getId()))
                .brand(brandService.getBrand(adv.getBrand().getId()))
                .fuelType(specificationService.getFuelType(adv.getFuelType().getId()))
                .driveType(specificationService.getDriveType(adv.getDriveType().getId()))
                .engineType(specificationService.getEngineType(adv.getEngineType().getId()))
                .transmissionType(specificationService.getTransmissionType(adv.getTransmissionType().getId()))
                .mileage(adv.getMileage())
                .mileageUnit(String.valueOf(adv.getMileageUnit()))
                .price(adv.getPrice())
                .priceUnit(String.valueOf(adv.getPriceUnit()))
                .engineCapacity(adv.getEngineCapacity())
                .engineHorsePower(adv.getEngineHorsePower())
                .firstRegistrationDate(adv.getFirstRegistrationDate())
                .productionDate(adv.getProductionDate())
                .creationDate(creationDate)
//                .city(cityService.getCityByName(adv.getCity().getName()))
//                .cityState(cityStateService.findCityStateByName(adv.getCity().getCityState().getName()))
//                .city(cityService.getCityByAjdi(adv.getCity().getId()).getName())
//                .cityState(cityStateService.findCityStateByAjdi(cityService.getCityByAjdi(adv.getCity().getId()).getCityState().getId()).getName())
                .mainPhotoUrl(adv.getMainPhotoUrl())
                .build();

        if (includeUserAndUrls) {
            builder.setUser(adv.getUser().getUsername());
            builder.setUrlList(adv.getImageUrls());
        }

        return builder;
    }

    public Advertisement getAdvertisement(String advertisementId) {
        return advertisementRepository.findById(UUID.fromString(advertisementId)).orElseThrow(() -> new InvalidParameterException("wrong advertisement"));
    }

    public int getPage(Integer pageNumber) {
        if (pageNumber == null) {
            pageNumber = 0;
        }
        return Math.max(pageNumber, 0);
    }

    public List<AdvertisementDTO> getAllUserAdvertisements(String username, String loggedUser) {
        if(username.equals(loggedUser)){
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
}
