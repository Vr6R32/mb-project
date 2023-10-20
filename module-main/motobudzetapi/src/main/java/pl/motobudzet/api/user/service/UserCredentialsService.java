package pl.motobudzet.api.user.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.motobudzet.api.user.dto.AppUserDTO;
import pl.motobudzet.api.user.entity.AppUser;
import pl.motobudzet.api.user.repository.AppUserRepository;

@Service
@RequiredArgsConstructor
public class UserCredentialsService {

    private final AppUserRepository userRepository;
    public AppUserDTO getUserDetails(String userName) {
        AppUser user = userRepository.findByUserNameForDto(userName).orElseThrow(() -> new IllegalArgumentException("USER_DOESNT_EXIST"));
        return mapUserToDTO(user);
    }

    private AppUserDTO mapUserToDTO(AppUser user) {
        return AppUserDTO.builder()
                .name(user.getUsername())
                .cityName(user.getCity().getName())
                .cityStateName(user.getCity().getCityState().getName()).build();
    }
}
