package pl.motobudzet.api.adapter.rest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.motobudzet.api.domain.user.dto.*;
import pl.motobudzet.api.domain.user.entity.AppUser;
import pl.motobudzet.api.domain.user.service.RegistrationService;
import pl.motobudzet.api.domain.user.service.UserDetailsService;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/user")
class UserController {

    private final RegistrationService registrationService;
    private final UserDetailsService userDetailsService;

    @PostMapping("register")
    public ResponseEntity<String> register(@RequestBody @Valid RegistrationRequest request) {
        return registrationService.register(request);
    }

    @GetMapping("confirm")
    public void confirmEmail(@RequestParam String activationCode, HttpServletResponse response, HttpServletRequest request) {
        registrationService.confirmEmail(activationCode, response,request);
    }

    @GetMapping("details")
    public AppUserDTO getUserDetails(Authentication authentication) {
        return userDetailsService.getUserDetails(authentication.getName());
    }

    @PutMapping("updateDetails")
    public ResponseEntity<?> updateFirstUserDetails(@RequestBody UserDetailsRequest userDetailsRequest, Authentication authentication, HttpServletResponse response, HttpServletRequest request) {
        AppUser loggedUser = (AppUser) authentication.getPrincipal();
        return userDetailsService.updateFirstUserDetails(userDetailsRequest,loggedUser,response,request);
    }

    @PostMapping("resetCode")
    public int generatePasswordResetCode(@RequestBody @Valid ResetPasswordRequest request) {
        return registrationService.generatePasswordResetCode(request);
    }

    @PostMapping("resetPassword")
    public int changeUserPassword(@RequestBody @Valid NewPasswordRequest request) {
        return registrationService.changeUserPassword(request);
    }
}
