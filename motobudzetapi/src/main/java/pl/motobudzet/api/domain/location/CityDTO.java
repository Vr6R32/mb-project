package pl.motobudzet.api.domain.location;

import lombok.Builder;

@Builder
public record CityDTO(Long id,String name,CityStateDTO cityState) {
}
