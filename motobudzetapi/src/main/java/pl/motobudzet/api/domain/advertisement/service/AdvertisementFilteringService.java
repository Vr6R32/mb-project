package pl.motobudzet.api.domain.advertisement.service;


import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import pl.motobudzet.api.domain.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.domain.advertisement.dto.AdvertisementFilterRequest;
import pl.motobudzet.api.domain.advertisement.entity.Advertisement;
import pl.motobudzet.api.domain.advertisement.model.Status;
import pl.motobudzet.api.domain.advertisement.repository.AdvertisementRepository;
import pl.motobudzet.api.domain.brand.BrandFacade;
import pl.motobudzet.api.domain.location.City;
import pl.motobudzet.api.domain.location.LocationFacade;
import pl.motobudzet.api.domain.model.ModelFacade;

import java.util.*;

@RequiredArgsConstructor
class AdvertisementFilteringService {

    private final AdvertisementRepository advertisementRepository;
    private final BrandFacade brandFacade;
    private final ModelFacade modelFacade;
    private final LocationFacade locationFacade;


    public Page<AdvertisementDTO> getFilteredAdvertisements(AdvertisementFilterRequest request, Integer pageNumber, String sortBy, String sortOrder) {

        Specification<Advertisement> specification = setAdvertisementFilterSpecification(request);
        PageRequest pageable = FilteringHelper.setPageRequest(pageNumber, sortBy, sortOrder);

        Page<UUID> advertisementSpecificationIds = advertisementRepository.findAll(specification, pageable).map(Advertisement::getId);
        List<UUID> uuidList = advertisementSpecificationIds.getContent();
        List<Advertisement> fetchedAdvertisementDetails = advertisementRepository.findByListOfUUIDs(uuidList);
        List<AdvertisementDTO> sortedAdvertisementList = FilteringHelper.sortAndMapAdvertisementsToDTO(uuidList, fetchedAdvertisementDetails);

        return new PageImpl<>(sortedAdvertisementList, pageable, advertisementSpecificationIds.getTotalElements());
    }

    public long getFilterResultCount(AdvertisementFilterRequest request) {
        Specification<Advertisement> specification = setAdvertisementFilterSpecification(request);
        return advertisementRepository.count(specification);
    }


    private Specification<Advertisement> setAdvertisementFilterSpecification(AdvertisementFilterRequest request) {

        String titleQueryParam = request.getTitle();

        Specification<Advertisement> specification = (root, query, criteriaBuilder) -> {
            Predicate statusActivePredicate = criteriaBuilder.equal(root.get("status"), Status.ACTIVE);
            Predicate combinedPredicate = criteriaBuilder.and(statusActivePredicate);
            combinedPredicate = FilteringHelper.handleTitleQueryPredicate(titleQueryParam, root, criteriaBuilder, combinedPredicate);
            return combinedPredicate;
        };

        Map<String, ServiceFunction> serviceFunctionMap = new HashMap<>();

        serviceFunctionMap.put("brand", brandFacade::getBrand);
        serviceFunctionMap.put("model", modelName -> modelFacade.getModelByNameAndBrandName(request.getModel(), request.getBrand()));

        specification = FilteringHelper.handleEntities(request, specification, serviceFunctionMap);

        specification = handleEnumValue(specification, request.getFuelType(), "fuelType");
        specification = handleEnumValue(specification, request.getDriveType(), "driveType");
        specification = handleEnumValue(specification, request.getEngineType(), "engineType");
        specification = handleEnumValue(specification, request.getTransmissionType(), "transmissionType");
        specification = FilteringHelper.handleValueInRangeBetween(specification, "price", request.getPriceMin(), request.getPriceMax());
        specification = FilteringHelper.handleValueInRangeBetween(specification, "mileage", request.getMileageFrom(), request.getMileageTo());
        specification = FilteringHelper.handleValueInRangeBetween(specification, "engineCapacity", request.getEngineCapacityFrom(), request.getEngineCapacityTo());
        specification = FilteringHelper.handleValueInRangeBetween(specification, "engineHorsePower", request.getEngineHorsePowerFrom(), request.getEngineHorsePowerTo());
        specification = FilteringHelper.handleValueInRangeBetween(specification, "productionDate", request.getProductionDateFrom(), request.getProductionDateTo());


        specification = handleCityAndStateValue(request, specification);

        return specification;
    }

    private <E extends Enum<E>> Specification<Advertisement> handleEnumValue(Specification<Advertisement> specification,
                                                                             E enumValue,
                                                                             String attributeName) {
        if (enumValue != null) {
            return specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get(attributeName), enumValue)
            );
        }
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
            List<City> cityList = locationFacade.getCitiesWithinDistance(city, distanceFrom);
            specification = specification.and((root, query, criteriaBuilder) ->
                    root.get("city").in(cityList)
            );
        } else if (city != null && !city.isEmpty()) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.equal(root.get("city"), locationFacade.getCityByName(city))
            );
        }
        return specification;
    }
}

