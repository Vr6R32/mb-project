package pl.motobudzet.api.domain.user.dto;


import lombok.Builder;
import pl.motobudzet.api.domain.location.CityDTO;

@Builder
public record AppUserDTO(String name,CityDTO city) {

}
