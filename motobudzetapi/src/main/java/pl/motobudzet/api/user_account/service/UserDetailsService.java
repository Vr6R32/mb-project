package pl.motobudzet.api.user_account.service;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.location_city.City;
import pl.motobudzet.api.location_city.LocationService;
import pl.motobudzet.api.user_account.dto.AppUserDTO;
import pl.motobudzet.api.user_account.dto.UserDetailsRequest;
import pl.motobudzet.api.user_account.entity.AppUser;
import pl.motobudzet.api.user_account.model.Role;
import pl.motobudzet.api.user_account.AppUserRepository;
import pl.motobudzet.api.z_configuration.securty_jwt.JwtService;

import java.util.Collections;
import java.util.List;

import static pl.motobudzet.api.z_configuration.securty_jwt.RedirectURLHandler.buildRedirectUrl;

@Service
@RequiredArgsConstructor
public class UserDetailsService {

    private final AppUserRepository userRepository;
    private final LocationService locationService;
    private final JwtService jwtService;


    public List<String> findManagementEmails() {
        return userRepository.findAllManagementEmails(Role.ROLE_ADMIN);
    }

    public AppUserDTO getUserDetails(String userName) {
        AppUser user = userRepository.findByUserNameWithRelationEntities(userName).orElseThrow(() -> new IllegalArgumentException("USER_DOESNT_EXIST"));
        return mapUserToDTO(user);
    }

    private AppUserDTO mapUserToDTO(AppUser user) {
        return AppUserDTO.builder().name(user.getUsername()).cityName(user.getCity().getName()).cityStateName(user.getCity().getCityState().getName()).build();
    }


    @Transactional
    public ResponseEntity<?> updateFirstUserDetails(UserDetailsRequest request, AppUser loggedUser, HttpServletResponse response, HttpServletRequest httpServletRequest) {

        City city = locationService.getCityByNameAndState(request.getCity(), request.getCityState());
        String name = request.getName();
        String surname = request.getSurname();
        String phoneNumber = request.getPhoneNumber();
        Role role = Role.ROLE_USER;
        String userEmail = loggedUser.getEmail();

            userRepository.insertUserFirstDetails(city.getId(), name, surname, phoneNumber, role, userEmail);
            String redirectUrl = buildRedirectUrl(httpServletRequest, "/?activation=true");
            loggedUser.setRole(role);
            jwtService.authenticate(loggedUser,response);
            return ResponseEntity.ok().body(Collections.singletonMap("redirectUrl", redirectUrl));
    }
}
