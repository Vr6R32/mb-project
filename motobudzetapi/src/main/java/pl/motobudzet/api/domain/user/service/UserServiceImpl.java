package pl.motobudzet.api.domain.user.service;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.adapter.facade.EmailManagerFacade;
import pl.motobudzet.api.adapter.facade.LocationFacade;
import pl.motobudzet.api.domain.location.City;
import pl.motobudzet.api.domain.user.UserDoesntExistException;
import pl.motobudzet.api.dto.AppUserDTO;
import pl.motobudzet.api.dto.NewPasswordRequest;
import pl.motobudzet.api.dto.ResetPasswordRequest;
import pl.motobudzet.api.dto.UserDetailsRequest;
import pl.motobudzet.api.domain.user.AppUser;
import pl.motobudzet.api.model.Role;
import pl.motobudzet.api.infrastructure.configuration.security.JwtService;
import pl.motobudzet.api.infrastructure.mapper.UserMapper;
import pl.motobudzet.api.model.EmailNotificationRequest;
import pl.motobudzet.api.model.EmailType;
import pl.motobudzet.api.persistance.AppUserRepository;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static pl.motobudzet.api.infrastructure.configuration.security.RedirectURLHandler.buildRedirectUrl;

@Service
@Slf4j
@RequiredArgsConstructor
class UserServiceImpl implements UserService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailManagerFacade mailService;
    private final LocationFacade locationFacade;
    private final JwtService jwtService;


    public AppUserDTO getUserDetails(String userName) {
        return userRepository.findUserDetailsByName(userName)
                .map(UserMapper::mapUserEntityToDTO)
                .orElseThrow(() -> new UserDoesntExistException("USER_DOESNT_EXIST"));
    }

    public ResponseEntity<?> updateFirstUserDetails(UserDetailsRequest request, AppUser loggedUser, HttpServletResponse response, HttpServletRequest httpServletRequest) {

        City city = locationFacade.getCityByNameAndState(request.city(), request.cityState());
        String name = request.name();
        String surname = request.surname();
        String phoneNumber = request.phoneNumber();
        String userEmail = loggedUser.getEmail();
        Role role = Role.ROLE_USER;

        userRepository.insertUserFirstDetails(city.getId(), name, surname, phoneNumber, role, userEmail);
        String redirectUrl = buildRedirectUrl(httpServletRequest, "/?activation=true");
        loggedUser.setRole(role);
        jwtService.authenticate(loggedUser, response);
        return ResponseEntity.ok().body(Collections.singletonMap("redirectUrl", redirectUrl));
    }

    @Transactional
    public int generatePasswordResetCode(ResetPasswordRequest request) {
        String resetCode = RandomStringUtils.randomAlphanumeric(30);
        LocalDateTime resetCodeExpirationTime = LocalDateTime.now().plusDays(1);

        int result = userRepository.insertResetPasswordCode(resetCode, resetCodeExpirationTime, request.email());

        AppUser user = userRepository.findUserByResetPasswordCode(resetCode)
                .orElseThrow(() -> new UserDoesntExistException("USER_DOESNT_EXIST"));

        log.info("[REGISTRATION-SERVICE] -> GENERATE PASSWORD RESET CODE FOR USER WITH ID -> [{}] EMAIL -> [{}] USERNAME -> [{}]",
                user.getId(), user.getEmail(), user.getUsername());

        mailService.publishEmailNotificationEvent(EmailNotificationRequest.builder().type(EmailType.RESET_PASS_CODE).userName(user.getUsername()).userResetPasswordCode(user.getResetPasswordCode()).receiverEmail(List.of(user.getEmail())).build());

        return result;
    }

    @Transactional
    public int changeUserPassword(NewPasswordRequest request) {

        if (!request.password().equals(request.passwordRepeat())) {
            return 0;
        }
        AppUser user = userRepository.findUserByResetPasswordCode(request.resetCode())
                .orElseThrow(() -> new UserDoesntExistException("USER_DOESNT_EXIST"));
        if (user.getResetPasswordCodeExpiration().isAfter(LocalDateTime.now())) {

            log.info("[REGISTRATION-SERVICE] -> CHANGE PASSWORD FOR USER WITH ID -> [{}] EMAIL -> [{}] USERNAME -> [{}]",
                    user.getId(), user.getEmail(), user.getUsername());

            return userRepository.insertNewUserPassword(passwordEncoder.encode(request.password()), request.resetCode());
        }
        return 0;
    }
}
