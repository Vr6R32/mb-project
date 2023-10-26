package pl.motobudzet.api.advertisement.service.utils.trash;


import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.advertisement.dto.AdvertisementFilterRequest;
import pl.motobudzet.api.advertisement.entity.Advertisement;
import pl.motobudzet.api.advertisement.repository.AdvertisementRepository;
import pl.motobudzet.api.advertisement.service.PublicAdvertisementService;
import pl.motobudzet.api.locationCity.entity.City;
import pl.motobudzet.api.locationCity.service.CityService;
import pl.motobudzet.api.locationState.service.CityStateService;
import pl.motobudzet.api.vehicleBrand.service.BrandService;
import pl.motobudzet.api.vehicleModel.service.ModelService;
import pl.motobudzet.api.vehicleSpec.service.SpecificationService;

import java.util.*;
import java.util.stream.Collectors;

import static pl.motobudzet.api.advertisement.service.PublicAdvertisementService.PAGE_SIZE;

@Service
@RequiredArgsConstructor
public class AdvertisementFilteringServiceOld {

    private final AdvertisementRepository advertisementRepository;
    private final PublicAdvertisementService publicAdvertisementService;
    private final SpecificationService specificationService;
    private final BrandService brandService;
    private final ModelService modelService;
    private final CityService cityService;
    private final CityStateService cityStateService;
    private final EntityManager entityManager;

    public Page<AdvertisementDTO> findAllPublicWithFilters(
//                                                           String brand, String model, String fuelType,
//                                                           String driveType, String engineType, String transmissionType,
//                                                           String city, String cityState,
//                                                           Long priceMin, Long priceMax, Long mileageFrom,
//                                                           Long mileageTo, Long engineCapacityFrom,
//                                                           Long engineCapacityTo, Long engineHorsePowerFrom,
//                                                           Long engineHorsePowerTo, Long productionDateFrom,
//                                                           Long productionDateTo,
                                                            AdvertisementFilterRequest request,
                                                           Integer distanceFrom,Integer pageNumber,
                                                           String sortBy, String sortOrder) {

        Specification<Advertisement> specification = Specification.where((root, query, criteriaBuilder) ->
                criteriaBuilder.isTrue(root.get("isVerified")));

//        Specification<Advertisement> specification = Specification.where((root, query, criteriaBuilder) ->
//                criteriaBuilder.equal(root.get("isVerified"), false));

        specification = setAdvertisementFilterSpecification(request, distanceFrom, specification);

        //        return advertisementRepository.findAll(specification, PageRequest.of(publicAdvertisementService.getPage(pageNumber), PAGE_SIZE, sort))
        //                .map(advertisement -> publicAdvertisementService.mapToAdvertisementDTO(advertisement, false));

        Sort sort = Sort.by(Sort.Direction.fromString(sortOrder), sortBy);

        PageRequest pageable = PageRequest.of(publicAdvertisementService.getPage(pageNumber), PAGE_SIZE, sort);
        Page<UUID> advertisementSpecificationIds = advertisementRepository.findAll(specification, pageable).map(Advertisement::getId);
        List<UUID> uuidList = advertisementSpecificationIds.getContent();

        List<Advertisement> fetchedAdvertisementDetails = advertisementRepository.findAllCustomByUUIDs(uuidList);
        List<Advertisement> advertisementDetails = uuidList.stream()
                .map(uuid -> fetchedAdvertisementDetails.stream()
                        .filter(adv -> adv.getId().equals(uuid))
                        .findFirst()
                        .orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        return new PageImpl<>(advertisementDetails, pageable, advertisementSpecificationIds.getTotalElements())
                .map(advertisement -> publicAdvertisementService.mapToAdvertisementDTO(advertisement, false));
    }

    private Specification<Advertisement> setAdvertisementFilterSpecification(AdvertisementFilterRequest request, Integer distanceFrom, Specification<Advertisement> specification) {
        String brand = request.getBrand();
        String model = request.getModel();
        String fuelType = request.getFuelType();
        String driveType = request.getDriveType();
        String engineType = request.getEngineType();
        String transmissionType = request.getTransmissionType();
        String city = request.getCity();
        String cityState = request.getCityState();
        Long priceMin = request.getPriceMin();
        Long priceMax = request.getPriceMax();
        Long mileageFrom = request.getMileageFrom();
        Long mileageTo= request.getMileageTo();
        Long engineCapacityFrom = request.getEngineCapacityFrom();
        Long engineCapacityTo = request.getEngineCapacityTo();
        Long engineHorsePowerFrom = request.getEngineHorsePowerFrom();
        Long engineHorsePowerTo = request.getEngineHorsePowerTo();
        Long productionDateFrom = request.getProductionDateFrom();
        Long productionDateTo = request.getProductionDateTo();

        if (brand != null && !brand.isEmpty()) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("brand"), brandService.getBrand(brand)));
        }

        if (city != null && distanceFrom != null) {
            List<City> cityList = cityService.getNeighbourCitiesByDistance(city, distanceFrom);
            specification = specification.and((root, query, criteriaBuilder) ->
                    root.get("city").in(cityList)
            );
        }
        else  if (city != null && !city.isEmpty()) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("city"), cityService.getCityByNameWithout(city))
            );
        }
        else if (cityState != null && !cityState.isEmpty() && city == null) {
            specification = specification.and((root, query, criteriaBuilder) -> {
                Join<Advertisement, City> cityJoin = root.join("city", JoinType.LEFT);
                return criteriaBuilder.equal(cityJoin.get("cityState").get("name"), cityState);
            });
        }

        if (model != null && !model.isEmpty()) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("model"), modelService.getModel(model)));
        }

        if (fuelType != null && !fuelType.isEmpty()) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("fuelType"), specificationService.getFuelType(fuelType)));
        }

        if (driveType != null && !driveType.isEmpty()) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("driveType"), specificationService.getDriveType(driveType)));
        }

        if (engineType != null && !engineType.isEmpty()) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("engineType"), specificationService.getEngineType(engineType)));
        }

        if (transmissionType != null && !transmissionType.isEmpty()) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("transmissionType"), specificationService.getTransmissionType(transmissionType)));
        }

        if (priceMin != null && priceMax != null) {
            if (priceMin.equals(priceMax)) {
                specification = specification.and((root, query, criteriaBuilder) ->
                        criteriaBuilder.equal(root.get("price"), priceMin));
            } else {
                specification = specification.and((root, query, criteriaBuilder) ->
                        criteriaBuilder.between(root.get("price"), priceMin, priceMax));
            }
        } else if (priceMin != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.greaterThanOrEqualTo(root.get("price"), priceMin));
        } else if (priceMax != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.lessThanOrEqualTo(root.get("price"), priceMax));
        }

        if (mileageFrom != null && mileageTo != null) {
            if (mileageFrom.equals(mileageTo)) {
                specification = specification.and((root, query, criteriaBuilder) ->
                        criteriaBuilder.equal(root.get("mileage"), mileageFrom));
            } else {
                specification = specification.and((root, query, criteriaBuilder) ->
                        criteriaBuilder.between(root.get("mileage"), mileageFrom, mileageTo));
            }
        } else if (mileageFrom != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.greaterThanOrEqualTo(root.get("mileage"), mileageFrom));
        } else if (mileageTo != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.lessThanOrEqualTo(root.get("mileage"), mileageTo));
        }


        if (engineCapacityFrom != null && engineCapacityTo != null) {
            if (engineCapacityFrom.equals(engineCapacityTo)) {
                specification = specification.and((root, query, criteriaBuilder) ->
                        criteriaBuilder.equal(root.get("engineCapacity"), engineCapacityFrom));
            } else {
                specification = specification.and((root, query, criteriaBuilder) ->
                        criteriaBuilder.between(root.get("engineCapacity"), engineCapacityFrom, engineCapacityTo));
            }
        } else if (engineCapacityFrom != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.greaterThanOrEqualTo(root.get("engineCapacity"), engineCapacityFrom));
        } else if (engineCapacityTo != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.lessThanOrEqualTo(root.get("engineCapacity"), engineCapacityTo));
        }

        if (engineHorsePowerFrom != null && engineHorsePowerTo != null) {
            if (engineHorsePowerFrom.equals(engineHorsePowerTo)) {
                specification = specification.and((root, query, criteriaBuilder) ->
                        criteriaBuilder.equal(root.get("engineHorsePower"), engineHorsePowerFrom));
            } else {
                specification = specification.and((root, query, criteriaBuilder) ->
                        criteriaBuilder.between(root.get("engineHorsePower"), engineHorsePowerFrom, engineHorsePowerTo));
            }
        } else if (engineHorsePowerFrom != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.greaterThanOrEqualTo(root.get("engineHorsePower"), engineHorsePowerFrom));
        } else if (engineHorsePowerTo != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.lessThanOrEqualTo(root.get("engineHorsePower"), engineHorsePowerTo));
        }

        if (productionDateFrom != null && productionDateTo != null) {
            if (productionDateFrom.equals(productionDateTo)) {
                specification = specification.and((root, query, criteriaBuilder) ->
                        criteriaBuilder.equal(root.get("productionDate"), productionDateFrom));
            } else {
                specification = specification.and((root, query, criteriaBuilder) ->
                        criteriaBuilder.between(root.get("productionDate"), productionDateFrom, productionDateTo));
            }
        } else if (productionDateFrom != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.greaterThanOrEqualTo(root.get("productionDate"), productionDateFrom));
        } else if (productionDateTo != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.lessThanOrEqualTo(root.get("productionDate"), productionDateTo));

        }
        return specification;
    }

    public long getCount(AdvertisementFilterRequest request,
                         Integer distanceFrom,Integer pageNumber,
                         String sortBy, String sortOrder) {
        Specification<Advertisement> specification = Specification.where((root, query, criteriaBuilder) ->
                criteriaBuilder.isTrue(root.get("isVerified")));

        specification = setAdvertisementFilterSpecification(request, distanceFrom, specification);
        Sort sort = Sort.by(Sort.Direction.fromString(sortOrder), sortBy);

        PageRequest pageable = PageRequest.of(publicAdvertisementService.getPage(pageNumber), PAGE_SIZE);
        Page<UUID> advertisementSpecificationIds = advertisementRepository.findAll(specification, pageable).map(Advertisement::getId);
        return advertisementSpecificationIds.getTotalElements();
    }

}

