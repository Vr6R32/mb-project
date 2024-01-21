package pl.motobudzet.api.user_account.service;


import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.location_city.LocationService;
import pl.motobudzet.api.user_account.dto.AppUserDTO;
import pl.motobudzet.api.user_account.dto.UserDetailsRequest;
import pl.motobudzet.api.user_account.entity.AppUser;
import pl.motobudzet.api.user_account.model.Role;
import pl.motobudzet.api.user_account.AppUserRepository;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsService {

    private final AppUserRepository userRepository;
    private final LocationService locationService;


    public List<String> findManagementEmails() {
        return userRepository.findAllManagementEmails(Role.ROLE_ADMIN);
    }

    public AppUserDTO getUserDetails(String userName) {
        AppUser user = userRepository.findByUserNameForDto(userName).orElseThrow(() -> new IllegalArgumentException("USER_DOESNT_EXIST"));
        return mapUserToDTO(user);
    }

    private AppUserDTO mapUserToDTO(AppUser user) {
        return AppUserDTO.builder().name(user.getUsername()).cityName(user.getCity().getName()).cityStateName(user.getCity().getCityState().getName()).build();
    }

    public String updateFirstUserDetails(UserDetailsRequest request, String loggedUser) {

        AppUser user = userRepository.findByUserNameForDto(loggedUser).orElseThrow(() -> new IllegalArgumentException("USER_DOESNT_EXIST"));
        user.setCity(locationService.getCityByNameAndState(request.getCity(), request.getCityState()));
        user.setName(request.getName());
        user.setSurname(request.getSurname());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(Role.ROLE_USER);

        userRepository.saveAndFlush(user);

        setAuthentication(user);

        return "/?activation=true";
    }

    private void setAuthentication(AppUser user) {
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user, null, Collections.singleton(new SimpleGrantedAuthority(String.valueOf(Role.ROLE_USER))));
        SecurityContextHolder.getContext().setAuthentication(auth);
    }
}
