package pl.motobudzet.api.user.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.emailSender.async.SpringMailSenderService;
import pl.motobudzet.api.user.dto.NewPasswordRequest;
import pl.motobudzet.api.user.dto.RegistrationRequest;
import pl.motobudzet.api.user.dto.ResetPasswordRequest;
import pl.motobudzet.api.user.entity.AppUser;
import pl.motobudzet.api.user.repository.AppUserRepository;
import pl.motobudzet.api.user.repository.RoleRepository;
import pl.motobudzet.api.utils.RegistrationRequestValidation;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final AppUserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final SpringMailSenderService springMailSenderService;
    private final SecurityContextRepository securityContextRepository;




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
                    .roles(List.of(roleRepository.findByName("ROLE_AWAITING_DETAILS").orElseThrow(() -> new RuntimeException("ROLE_NOT_FOUND"))))
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

//    public ResponseEntity<String> activateAccount(String activationLink,HttpServletResponse response,HttpServletRequest request) {
//        AppUser user = userRepository.getAppUserByRegisterCode(activationLink).orElseThrow(() -> new IllegalArgumentException("WRONG_ACTIVATION_CODE"));
//
////        if(user!=null){
//        if(user!=null && !user.getAccountEnabled()){
//            user.setAccountEnabled(true);
//            AppUser enabledUser = userRepository.saveAndFlush(user);
//            setAuthentication(response, request, enabledUser);
//            return ResponseEntity.ok("Konto aktywowane!");
//        }
//        return ResponseEntity.ok("Link nieaktwny!");
//    }

    public ResponseEntity<Void> confirmEmail(String activationLink, HttpServletResponse response, HttpServletRequest request) {
        AppUser user = userRepository.getAppUserByRegisterCode(activationLink).orElseThrow(() -> new IllegalArgumentException("WRONG_ACTIVATION_CODE"));

        if(user != null && !user.getAccountEnabled()){
            user.setAccountEnabled(true);
            AppUser enabledUser = userRepository.saveAndFlush(user);
            setAuthentication(response, request, enabledUser);

            try {
                response.sendRedirect("/user/details?activation=true");
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
        return ResponseEntity.status(HttpStatus.FOUND).build();
    }


    private void setAuthentication(HttpServletResponse response, HttpServletRequest request, AppUser enabledUser) {
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(enabledUser.getUsername(), null, enabledUser.getAuthorities());
        SecurityContext sc = SecurityContextHolder.getContext();
        sc.setAuthentication(authToken);
        securityContextRepository.saveContext(sc, request, response);
    }

    @Transactional
    public int generatePasswordResetCode(ResetPasswordRequest request) {
        String resetCode = RandomStringUtils.randomAlphanumeric(30);
        LocalDateTime resetCodeExpirationTime = LocalDateTime.now(ZoneId.of("Europe/Warsaw")).plusDays(1);

        int result = userRepository.insertResetPasswordCode(resetCode, resetCodeExpirationTime, request.getEmail());

        AppUser user = userRepository.findByResetCode(resetCode)
                .orElseThrow(() -> new IllegalArgumentException("USER_DOESNT_EXIST"));

        springMailSenderService.sendResetPasswordNotificationCodeLink(user);

        return result;
    }
    @Transactional
    public int changeUserPassword(NewPasswordRequest request) {

        if (!request.getPassword().equals(request.getPasswordRepeat())) {
            return 0;
        }

        AppUser user = userRepository.findByResetCode(request.getResetCode())
                .orElseThrow(() -> new IllegalArgumentException("USER_DOESNT_EXIST"));

        if (user.getResetPasswordCodeExpiration().isAfter(LocalDateTime.now(ZoneId.of("Europe/Warsaw")))) {
            return userRepository.insertNewUserPassword(passwordEncoder.encode(request.getPassword()), request.getResetCode());
        }

        return 0;
    }
}
