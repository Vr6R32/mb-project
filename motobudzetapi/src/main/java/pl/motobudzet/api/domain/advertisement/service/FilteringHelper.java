package pl.motobudzet.api.domain.advertisement.service;

import jakarta.persistence.criteria.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import pl.motobudzet.api.dto.AdvertisementDTO;
import pl.motobudzet.api.dto.AdvertisementFilterRequest;
import pl.motobudzet.api.domain.advertisement.entity.Advertisement;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import static pl.motobudzet.api.domain.advertisement.service.AdvertisementServiceImpl.PAGE_SIZE;
import static pl.motobudzet.api.infrastructure.mapper.AdvertisementMapper.mapToAdvertisementDTO;

public class FilteringHelper {

    private FilteringHelper() {
    }

    public static PageRequest setPageRequest(Integer pageNumber, String sortBy, String sortOrder) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortOrder), sortBy);
        return PageRequest.of(getPage(pageNumber), PAGE_SIZE, sort);
    }

    public static int getPage(Integer pageNumber) {
        if (pageNumber == null) {
            pageNumber = 0;
        }
        return Math.max(pageNumber, 0);
    }

    public static <T extends Comparable<T>> Specification<Advertisement> handleValueInRangeBetween(Specification<Advertisement> specification, String fieldName, T min, T max) {
        if (min != null && max != null) {
            if (min.equals(max)) {
                specification = specification.and((root, query, criteriaBuilder) ->
                        criteriaBuilder.equal(root.get(fieldName), min));
            } else {
                specification = specification.and((root, query, criteriaBuilder) ->
                        criteriaBuilder.between(root.get(fieldName), min, max));
            }
        } else if (min != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.greaterThanOrEqualTo(root.get(fieldName), min));
        } else if (max != null) {
            specification = specification.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.lessThanOrEqualTo(root.get(fieldName), max));
        }
        return specification;
    }

    public static Specification<Advertisement> handleEntities(AdvertisementFilterRequest request, Specification<Advertisement> specification, Map<String, ServiceFunction> serviceFunctionMap) {

        for (Field field : AdvertisementFilterRequest.class.getDeclaredFields()) {
            field.setAccessible(true);
            try {
                Object value = field.get(request);
                if (value != null && !value.toString().isEmpty()) {
                    if (serviceFunctionMap.containsKey(field.getName())) {
                        ServiceFunction serviceFunction = serviceFunctionMap.get(field.getName());
                        Object serviceValue = serviceFunction.apply(value.toString());
                        specification = specification.and((root, query, criteriaBuilder) ->
                                criteriaBuilder.equal(root.get(field.getName()), serviceValue));
                    }
                }
            } catch (IllegalAccessException e) {
                // TODO HANDLE EXCEPTION
            }
        }
        return specification;
    }

    static List<AdvertisementDTO> sortAndMapAdvertisementsToDTO(List<UUID> uuidList, List<Advertisement> fetchedAdvertisementDetails) {
        Map<UUID, Advertisement> advertisementMap = fetchedAdvertisementDetails.stream()
                .collect(Collectors.toMap(Advertisement::getId, Function.identity()));

        return uuidList.stream()
                .map(advertisementMap::get)
                .filter(Objects::nonNull)
                .map(advertisement -> mapToAdvertisementDTO(advertisement, false))
                .toList();
    }


    static Predicate handleTitleQueryPredicate(String titleQueryParam, Root<Advertisement> root, CriteriaBuilder criteriaBuilder, Predicate combinedPredicate) {
        if (titleQueryParam != null && !titleQueryParam.isEmpty()) {
            String[] words = titleQueryParam.toLowerCase().split("\\s+");
            Predicate titlePredicate = criteriaBuilder.disjunction();
            for (String word : words) {
                String searchWord = "%" + word + "%";
                titlePredicate = criteriaBuilder.or(titlePredicate,
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchWord));
            }
            combinedPredicate = criteriaBuilder.and(combinedPredicate, titlePredicate);
        }
        return combinedPredicate;
    }


}
