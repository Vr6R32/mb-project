package pl.motobudzet.api.dto;

import lombok.Builder;

@Builder
public record CityDTO(Long id, String name, CityStateDTO cityState) {
}
