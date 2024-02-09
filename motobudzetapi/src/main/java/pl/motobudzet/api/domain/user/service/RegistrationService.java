package pl.motobudzet.api.domain.user.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.domain.user.UserDoesntExistException;
import pl.motobudzet.api.model.EmailNotificationRequest;
import pl.motobudzet.api.persistance.AppUserRepository;
import pl.motobudzet.api.domain.user.dto.NewPasswordRequest;
import pl.motobudzet.api.domain.user.dto.ResetPasswordRequest;
import pl.motobudzet.api.domain.user.model.Role;
import pl.motobudzet.api.infrastructure.mailing.EmailManagerFacade;
import pl.motobudzet.api.domain.user.utils.RegistrationRequestValidation;
import pl.motobudzet.api.domain.user.dto.RegistrationRequest;
import pl.motobudzet.api.domain.user.entity.AppUser;
import pl.motobudzet.api.infrastructure.configuration.securty_jwt.JwtService;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import static pl.motobudzet.api.infrastructure.configuration.securty_jwt.RedirectURLHandler.buildRedirectUrl;

@Service
@RequiredArgsConstructor
public class RegistrationService {

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

            mailService.sendRegisterActivationNotificationHtml(buildEmailNotificationRequest(newUser));

            return ResponseEntity.ok()
                    .headers(httpHeaders -> {
                        httpHeaders.set("registered", "true");
                    })
                    .contentType(MediaType.TEXT_HTML)
                    .body("Zarejerstrowano pomyślnie !" + "Na podany adres e-mail przyjdzie link aktywacyjny.");
        }
    }

    private EmailNotificationRequest buildEmailNotificationRequest(AppUser newUser) {
        return EmailNotificationRequest.builder()
                .userName(newUser.getUsername())
                .userRegisterCode(newUser.getRegisterCode())
                .receiverEmail(List.of(newUser.getEmail()))
                .build();
    }

    public void confirmEmail(String registrationCode, HttpServletResponse response, HttpServletRequest request) {
        AppUser user = userRepository.findUserByRegistrationCode(registrationCode).orElseThrow(() -> new UserDoesntExistException("WRONG_ACTIVATION_CODE"));

        if (user != null && !user.isEnabled()) {
            user.setAccountEnabled(true);
            AppUser enabledUser = userRepository.saveAndFlush(user);
            jwtService.authenticate(enabledUser,response);

            try {
                String redirectUrl = buildRedirectUrl(request, "/user/details?activation=true");
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

    @Transactional
    public int generatePasswordResetCode(ResetPasswordRequest request) {
        String resetCode = RandomStringUtils.randomAlphanumeric(30);
        LocalDateTime resetCodeExpirationTime = LocalDateTime.now().plusDays(1);

        int result = userRepository.insertResetPasswordCode(resetCode, resetCodeExpirationTime, request.email());

        AppUser user = userRepository.findUserByResetPasswordCode(resetCode)
                .orElseThrow(() -> new UserDoesntExistException("USER_DOESNT_EXIST"));

        mailService.sendResetPasswordNotificationCodeLink(EmailNotificationRequest.builder().userName(user.getUsername()).userResetPasswordCode(user.getResetPasswordCode()).receiverEmail(List.of(user.getEmail())).build());

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
            return userRepository.insertNewUserPassword(passwordEncoder.encode(request.password()), request.resetCode());
        }
        return 0;
    }
}
