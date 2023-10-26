package pl.motobudzet.api.advertisement.service.utils;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;
import pl.motobudzet.api.advertisement.dto.AdvertisementFilterRequest;
import pl.motobudzet.api.advertisement.entity.Advertisement;
import pl.motobudzet.api.locationCity.entity.City;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class SpecificationHelper {

    private SpecificationHelper() {
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
            field.setAccessible(true); // by móc czytać prywatne pola
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
                // Obsłuż wyjątek
            }
        }
        return specification;
    }

}
