package pl.motobudzet.api.domain.user.dto;

import lombok.Builder;
import pl.motobudzet.api.dto.CityDTO;

@Builder
public record AppUserDTO(
        Long id,
        String userName,
        String email,
        String registerCode,
        String resetPasswordCode,
        String name,
        String surname,
        String phoneNumber,
        CityDTO city
) {
}
