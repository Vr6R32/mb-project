package pl.motobudzet.api.infrastructure.mapper;

import pl.motobudzet.api.domain.user.dto.AppUserDTO;
import pl.motobudzet.api.domain.user.entity.AppUser;

public class UserMapper {

    private UserMapper() {
    }

    public static AppUserDTO mapUserToDTO(AppUser user) {
        return AppUserDTO.builder()
                .name(user.getUsername())
                .city(CityMapper.mapToCityDTO(user.getCity()))
                .build();
    }
}
