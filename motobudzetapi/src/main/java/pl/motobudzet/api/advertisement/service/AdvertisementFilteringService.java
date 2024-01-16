package pl.motobudzet.api.advertisement.service;


import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.advertisement.dto.AdvertisementFilterRequest;
import pl.motobudzet.api.advertisement.entity.Advertisement;
import pl.motobudzet.api.advertisement.repository.AdvertisementRepository;
import pl.motobudzet.api.location_city.City;
import pl.motobudzet.api.location_city.LocationService;
import pl.motobudzet.api.vehicleBrand.BrandService;
import pl.motobudzet.api.vehicleModel.ModelService;
import pl.motobudzet.api.vehicleSpec.service.SpecificationService;

import java.util.*;

import static pl.motobudzet.api.advertisement.service.FilteringHelper.*;

@Service
@RequiredArgsConstructor
public class AdvertisementFilteringService {

    private final AdvertisementRepository advertisementRepository;
    private final SpecificationService specificationService;
    private final BrandService brandService;
    private final ModelService modelService;
    private final LocationService locationService;


    public Page<AdvertisementDTO> getFilteredAdvertisements(AdvertisementFilterRequest request, Integer pageNumber, String sortBy, String sortOrder) {

        Specification<Advertisement> specification = setAdvertisementFilterSpecification(request);
        PageRequest pageable = setPageRequest(pageNumber, sortBy, sortOrder);

        Page<UUID> advertisementSpecificationIds = advertisementRepository.findAll(specification, pageable).map(Advertisement::getId);
        List<UUID> uuidList = advertisementSpecificationIds.getContent();
        List<Advertisement> fetchedAdvertisementDetails = advertisementRepository.findByListOfUUIDs(uuidList);
        List<AdvertisementDTO> sortedAdvertisementList = sortAndMapAdvertisementsToDTO(uuidList, fetchedAdvertisementDetails);

        return new PageImpl<>(sortedAdvertisementList, pageable, sortedAdvertisementList.size());
    }

    public long getFilterResultCount(AdvertisementFilterRequest request) {
        Specification<Advertisement> specification = setAdvertisementFilterSpecification(request);
        return advertisementRepository.count(specification);
    }


    private Specification<Advertisement> setAdvertisementFilterSpecification(AdvertisementFilterRequest request) {

        String titleQueryParam = request.getTitle();

        Specification<Advertisement> specification = (root, query, criteriaBuilder) -> {
            Predicate isVerifiedPredicate = criteriaBuilder.isTrue(root.get("isVerified"));
            Predicate isActivePredicate = criteriaBuilder.isTrue(root.get("isActive"));
            Predicate isDeletedPredicate = criteriaBuilder.isFalse(root.get("isDeleted"));
            Predicate combinedPredicate = criteriaBuilder.and(isVerifiedPredicate, isActivePredicate, isDeletedPredicate);
            combinedPredicate = handleTitleQueryPredicate(titleQueryParam, root, criteriaBuilder, combinedPredicate);
            return combinedPredicate;
        };

        Map<String, ServiceFunction> serviceFunctionMap = new HashMap<>();

        serviceFunctionMap.put("brand", brandService::getBrand);
        serviceFunctionMap.put("model", modelName -> modelService.getModelByBrand(request.getModel(), request.getBrand()));
        serviceFunctionMap.put("fuelType", specificationService::getFuelType);
        serviceFunctionMap.put("driveType", specificationService::getDriveType);
        serviceFunctionMap.put("engineType", specificationService::getEngineType);
        serviceFunctionMap.put("transmissionType", specificationService::getTransmissionType);

        specification = handleSelectValues(request, specification, serviceFunctionMap);
        specification = handleValueInRangeBetween(specification, "price", request.getPriceMin(), request.getPriceMax());
        specification = handleValueInRangeBetween(specification, "mileage", request.getMileageFrom(), request.getMileageTo());
        specification = handleValueInRangeBetween(specification, "engineCapacity", request.getEngineCapacityFrom(), request.getEngineCapacityTo());
        specification = handleValueInRangeBetween(specification, "engineHorsePower", request.getEngineHorsePowerFrom(), request.getEngineHorsePowerTo());
        specification = handleValueInRangeBetween(specification, "productionDate", request.getProductionDateFrom(), request.getProductionDateTo());


        specification = handleCityAndStateValue(request, specification);

        return specification;
    }

    private Specification<Advertisement> handleCityAndStateValue(AdvertisementFilterRequest request, Specification<Advertisement> specification) {
        String city = request.getCity();
        String cityState = request.getCityState();
        Integer distanceFrom = request.getDistanceFrom() != null ? request.getDistanceFrom() : 0;


        if (cityState != null && !cityState.isEmpty() && (city == null || city.isEmpty())) {
            specification = specification.and((root, query, criteriaBuilder) -> {
                Join<Advertisement, City> cityJoin = root.join("city", JoinType.LEFT);
                return criteriaBuilder.equal(cityJoin.get("cityState").get("name"), cityState);
            });
        } else if (city != null && !city.isEmpty() && distanceFrom != 0) {
            List<City> cityList = locationService.getCitiesWithinDistance(city, distanceFrom);
            specification = specification.and((root, query, criteriaBuilder) ->
                    root.get("city").in(cityList)
            );
        } else if (city != null && !city.isEmpty()) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("city"), locationService.getCityByNameWithout(city))
            );
        }
        return specification;
    }
}

