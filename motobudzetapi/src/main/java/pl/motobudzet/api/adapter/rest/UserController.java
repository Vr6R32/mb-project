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
import pl.motobudzet.api.adapter.facade.AppUserFacade;


@RestController
@RequestMapping("api/user")
@RequiredArgsConstructor
class UserController {

    private final AppUserFacade appUserFacade;

    @PostMapping("register")
    public ResponseEntity<String> register(@RequestBody @Valid RegistrationRequest request) {
        return appUserFacade.register(request);
    }

    @GetMapping("confirm")
    public void confirmEmail(@RequestParam String activationCode, HttpServletResponse response, HttpServletRequest request) {
        appUserFacade.confirmEmail(activationCode, response,request);
    }

    @GetMapping("details")
    public AppUserDTO getUserDetails(Authentication authentication) {
        return appUserFacade.getUserDetails(authentication.getName());
    }

    @PutMapping("updateDetails")
    public ResponseEntity<?> updateFirstUserDetails(@RequestBody UserDetailsRequest userDetailsRequest, Authentication authentication, HttpServletResponse response, HttpServletRequest request) {
        AppUser loggedUser = (AppUser) authentication.getPrincipal();
        return appUserFacade.updateFirstUserDetails(userDetailsRequest,loggedUser,response,request);
    }

    @PostMapping("resetCode")
    public int generatePasswordResetCode(@RequestBody @Valid ResetPasswordRequest request) {
        return appUserFacade.generatePasswordResetCode(request);
    }

    @PostMapping("resetPassword")
    public int changeUserPassword(@RequestBody @Valid NewPasswordRequest request) {
        return appUserFacade.changeUserPassword(request);
    }
}
