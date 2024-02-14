package pl.motobudzet.api.dto;

import lombok.Builder;

@Builder
public record AppUserDTO(
        Long id,
        String userName,
        String email,
        CityDTO city
) {
}
