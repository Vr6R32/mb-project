package pl.motobudzet.api.infrastructure.mapper;

import pl.motobudzet.api.dto.AppUserDTO;
import pl.motobudzet.api.domain.user.AppUser;

public class UserMapper {

    private UserMapper() {
    }

    public static AppUserDTO mapUserEntityToDTO(AppUser user) {
        return AppUserDTO.builder()
                .id(user.getId())
                .userName(user.getUsername())
                .email(user.getEmail())
                .city(CityMapper.mapToCityDTO(user.getCity()))
                .build();
    }

}
