package pl.motobudzet.api.infrastructure.mapper;

import pl.motobudzet.api.domain.user.dto.AppUserDTO;
import pl.motobudzet.api.domain.user.entity.AppUser;

public class UserMapper {

    private UserMapper() {
    }

    public static AppUserDTO mapUserEntityToDTOwithLocationDetail(AppUser user) {
        return AppUserDTO.builder()
                .id(user.getId())
                .userName(user.getUsername())
                .email(user.getEmail())
                .name(user.getName())
                .surname(user.getSurname())
                .phoneNumber(user.getPhoneNumber())
                .city(CityMapper.mapToCityDTO(user.getCity()))
                .build();
    }

    public static AppUserDTO mapUserEntityToDTO(AppUser user) {
        return AppUserDTO.builder()
                .id(user.getId())
                .userName(user.getUsername())
                .email(user.getEmail())
                .registerCode(user.getRegisterCode())
                .resetPasswordCode(user.getResetPasswordCode())
                .name(user.getName())
                .surname(user.getSurname())
                .phoneNumber(user.getPhoneNumber())
                .build();
    }
}
