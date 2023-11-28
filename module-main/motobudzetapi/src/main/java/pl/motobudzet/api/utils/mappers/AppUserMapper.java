package pl.motobudzet.api.utils.mappers;

import pl.motobudzet.api.user.dto.AppUserDTO;
import pl.motobudzet.api.user.entity.AppUser;

public class AppUserMapper {

    private AppUserMapper() {
    }

    public static AppUserDTO mapUserToDTO(AppUser user) {
        return AppUserDTO.builder().name(user.getUsername()).cityName(user.getCity().getName()).cityStateName(user.getCity().getCityState().getName()).build();
    }
}
