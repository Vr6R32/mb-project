package pl.motobudzet.api.user_account.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.motobudzet.api.user_account.dto.*;
import pl.motobudzet.api.user_account.service.RegistrationService;
import pl.motobudzet.api.user_account.service.UserDetailsService;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/user")
public class UserController {

    private final RegistrationService registrationService;
    private final UserDetailsService userDetailsService;

    @PostMapping("register")
    public ResponseEntity<String> register(@RequestBody @Valid RegistrationRequest request) {
        return registrationService.register(request);
    }
    @GetMapping("confirm")
    public ResponseEntity<Void> confirmEmail(@RequestParam String activationCode, HttpServletResponse response, HttpServletRequest request){
        return registrationService.confirmEmail(activationCode,response,request);
    }
    @GetMapping("details")
    public AppUserDTO getUserDetails(Authentication authentication){
        return userDetailsService.getUserDetails(authentication.getName());
    }
    @PutMapping ("updateDetails")
    public String updateFirstUserDetails(@RequestBody UserDetailsRequest userDetailsRequest, Authentication authentication){
        return userDetailsService.updateFirstUserDetails(userDetailsRequest,authentication.getName());
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
