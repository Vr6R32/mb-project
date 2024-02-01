package pl.motobudzet.api.domain.user.service;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.adapter.facade.LocationFacade;
import pl.motobudzet.api.infrastructure.configuration.securty_jwt.JwtService;
import pl.motobudzet.api.persistance.AppUserRepository;
import pl.motobudzet.api.domain.user.dto.AppUserDTO;
import pl.motobudzet.api.domain.user.dto.UserDetailsRequest;
import pl.motobudzet.api.domain.user.entity.AppUser;
import pl.motobudzet.api.domain.user.model.Role;
import pl.motobudzet.api.domain.location.City;

import java.util.Collections;
import java.util.List;

import static pl.motobudzet.api.infrastructure.configuration.securty_jwt.RedirectURLHandler.buildRedirectUrl;
import static pl.motobudzet.api.infrastructure.mapper.UserMapper.mapUserToDTO;

@Service
@RequiredArgsConstructor
public class UserDetailsService {

    private final AppUserRepository userRepository;
    private final LocationFacade locationFacade;
    private final JwtService jwtService;

    public List<String> findManagementEmails() {
        return userRepository.findAllManagementEmails(Role.ROLE_ADMIN);
    }

    public AppUserDTO getUserDetails(String userName) {
        AppUser user = userRepository.findByUserNameWithRelationEntities(userName).orElseThrow(() -> new IllegalArgumentException("USER_DOESNT_EXIST"));
        return mapUserToDTO(user);
    }

    @Transactional
    public ResponseEntity<?> updateFirstUserDetails(UserDetailsRequest request, AppUser loggedUser, HttpServletResponse response, HttpServletRequest httpServletRequest) {

        City city = locationFacade.getCityByNameAndState(request.getCity(), request.getCityState());
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
