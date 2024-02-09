package pl.motobudzet.api.domain.location;

import lombok.Builder;

@Builder
public record CityStateDTO(String id,String name) {

}
