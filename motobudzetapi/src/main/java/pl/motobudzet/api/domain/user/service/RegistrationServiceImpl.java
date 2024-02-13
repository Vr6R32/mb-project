package pl.motobudzet.api.domain.user.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.adapter.facade.EmailManagerFacade;
import pl.motobudzet.api.domain.user.UserDoesntExistException;
import pl.motobudzet.api.domain.user.dto.RegistrationRequest;
import pl.motobudzet.api.domain.user.entity.AppUser;
import pl.motobudzet.api.domain.user.model.Role;
import pl.motobudzet.api.domain.user.utils.RegistrationRequestValidation;
import pl.motobudzet.api.infrastructure.configuration.security.JwtService;
import pl.motobudzet.api.model.EmailNotificationRequest;
import pl.motobudzet.api.model.EmailType;
import pl.motobudzet.api.persistance.AppUserRepository;

import java.io.IOException;
import java.util.List;

import static pl.motobudzet.api.infrastructure.configuration.security.RedirectURLHandler.buildRedirectUrl;

@Service
@Slf4j
@RequiredArgsConstructor
class RegistrationServiceImpl implements RegistrationService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailManagerFacade mailService;
    private final JwtService jwtService;


    public ResponseEntity<String> register(RegistrationRequest request) {
        String validateResponse = RegistrationRequestValidation.validate(request, userRepository);

        if (!validateResponse.equals("Both username and email are available")) {
            return ResponseEntity.badRequest()
                    .body(validateResponse);
        } else {

            String code = RandomStringUtils.randomAlphanumeric(30, 30);

            AppUser newUser = AppUser.builder()
                    .userName(request.userName())
                    .password(passwordEncoder.encode(request.password()))
                    .email(request.email())
                    .registerCode(code)
                    .accountEnabled(false)
                    .accountNotLocked(true)
                    .accountNotExpired(true)
                    .credentialsNotExpired(true)
                    .role(Role.ROLE_AWAITING_DETAILS)
                    .build();
            userRepository.save(newUser);

            log.info("[REGISTRATION-SERVICE] -> REGISTER NEW USER WITH ID -> [{}] EMAIL -> [{}] USERNAME -> [{}]",
                    newUser.getId(), newUser.getEmail(), newUser.getUsername());

            mailService.publishEmailNotificationEvent(buildEmailNotificationRequest(newUser));


            return ResponseEntity.ok()
                    .headers(httpHeaders ->
                            httpHeaders.set("registered", "true")
                    )
                    .contentType(MediaType.TEXT_HTML)
                    .body("Zarejerstrowano pomyślnie !" + "Na podany adres e-mail przyjdzie link aktywacyjny.");
        }
    }

    public void confirmEmail(String registrationCode, HttpServletResponse response, HttpServletRequest request) {
        AppUser user = userRepository.findUserByRegistrationCode(registrationCode).orElseThrow(() -> new UserDoesntExistException("WRONG_ACTIVATION_CODE"));

        if (user != null && !user.isEnabled()) {
            user.setAccountEnabled(true);
            AppUser enabledUser = userRepository.saveAndFlush(user);
            jwtService.authenticate(enabledUser, response);

            try {
                String redirectUrl = buildRedirectUrl(request, "/user/details?activation=true");

                log.info("[REGISTRATION-SERVICE] -> CONFIRM USER ACCOUNT EMAIL WITH ID -> [{}] EMAIL -> [{}] USERNAME -> [{}]",
                        user.getId(), user.getEmail(), user.getUsername());

                response.sendRedirect(redirectUrl);
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            try {
                response.sendRedirect("/");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private EmailNotificationRequest buildEmailNotificationRequest(AppUser newUser) {
        return EmailNotificationRequest.builder()
                .type(EmailType.REGISTER_ACTIVATION)
                .userName(newUser.getUsername())
                .userRegisterCode(newUser.getRegisterCode())
                .receiverEmail(List.of(newUser.getEmail()))
                .build();
    }

}
