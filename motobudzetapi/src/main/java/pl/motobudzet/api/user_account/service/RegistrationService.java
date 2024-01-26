package pl.motobudzet.api.user_account.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.emailSender.SpringMailSenderService;
import pl.motobudzet.api.user_account.utils.RegistrationRequestValidation;
import pl.motobudzet.api.user_account.dto.NewPasswordRequest;
import pl.motobudzet.api.user_account.dto.RegistrationRequest;
import pl.motobudzet.api.user_account.dto.ResetPasswordRequest;
import pl.motobudzet.api.user_account.entity.AppUser;
import pl.motobudzet.api.user_account.model.Role;
import pl.motobudzet.api.user_account.AppUserRepository;
import pl.motobudzet.api.z_configuration.securty_jwt.JwtService;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;

import static pl.motobudzet.api.z_configuration.securty_jwt.RedirectURLHandler.buildRedirectUrl;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SpringMailSenderService springMailSenderService;
    private final JwtService jwtService;


    public ResponseEntity<String> register(RegistrationRequest request) {

        String validateResponse = RegistrationRequestValidation.validate(request, userRepository);

        if (!validateResponse.equals("Both username and email are available")) {
            return ResponseEntity.badRequest()
                    .body(validateResponse);
        } else {

            String code = RandomStringUtils.randomAlphanumeric(30, 30);

            AppUser newUser = AppUser.builder()
                    .userName(request.getUserName())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .email(request.getEmail())
                    .registerCode(code)
                    .accountEnabled(false)
                    .accountNotLocked(true)
                    .accountNotExpired(true)
                    .credentialsNotExpired(true)
                    .role(Role.ROLE_AWAITING_DETAILS)
                    .build();
            userRepository.saveAndFlush(newUser);

            springMailSenderService.sendRegisterActivationNotificationHtml(newUser);

            return ResponseEntity.ok()
                    .headers(httpHeaders -> {
                        httpHeaders.set("registered", "true");
                    })
                    .contentType(MediaType.TEXT_HTML)
                    .body("Zarejerstrowano pomyślnie !" + "Na podany adres e-mail przyjdzie link aktywacyjny.");
        }
    }

    public void confirmEmail(String activationLink, HttpServletResponse response, HttpServletRequest request) {
        AppUser user = userRepository.findUserByRegistrationCode(activationLink).orElseThrow(() -> new IllegalArgumentException("WRONG_ACTIVATION_CODE"));

        if (user != null && !user.getAccountEnabled()) {
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
        LocalDateTime resetCodeExpirationTime = LocalDateTime.now(ZoneId.of("Europe/Warsaw")).plusDays(1);

        int result = userRepository.insertResetPasswordCode(resetCode, resetCodeExpirationTime, request.getEmail());

        AppUser user = userRepository.findUserByResetPasswordCode(resetCode)
                .orElseThrow(() -> new IllegalArgumentException("USER_DOESNT_EXIST"));

        springMailSenderService.sendResetPasswordNotificationCodeLink(user);

        return result;
    }

    @Transactional
    public int changeUserPassword(NewPasswordRequest request) {

        if (!request.getPassword().equals(request.getPasswordRepeat())) {
            return 0;
        }
        AppUser user = userRepository.findUserByResetPasswordCode(request.getResetCode())
                .orElseThrow(() -> new IllegalArgumentException("USER_DOESNT_EXIST"));
        if (user.getResetPasswordCodeExpiration().isAfter(LocalDateTime.now(ZoneId.of("Europe/Warsaw")))) {
            return userRepository.insertNewUserPassword(passwordEncoder.encode(request.getPassword()), request.getResetCode());
        }
        return 0;
    }
}
