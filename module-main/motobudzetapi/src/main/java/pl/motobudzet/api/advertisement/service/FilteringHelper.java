package pl.motobudzet.api.advertisement.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import pl.motobudzet.api.advertisement.dto.AdvertisementFilterRequest;
import pl.motobudzet.api.advertisement.entity.Advertisement;
import pl.motobudzet.api.advertisement.service.ServiceFunction;

import java.lang.reflect.Field;
import java.util.Map;

import static pl.motobudzet.api.advertisement.service.AdvertisementService.PAGE_SIZE;

public class FilteringHelper {


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

    public static Specification<Advertisement> handleSelectValue(AdvertisementFilterRequest request, Specification<Advertisement> specification, Map<String, ServiceFunction> serviceFunctionMap) {
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

}