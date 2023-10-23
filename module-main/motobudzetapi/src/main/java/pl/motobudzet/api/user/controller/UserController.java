package pl.motobudzet.api.user.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.motobudzet.api.user.dto.AppUserDTO;
import pl.motobudzet.api.user.service.RegistrationService;
import pl.motobudzet.api.user.dto.RegistrationRequest;
import pl.motobudzet.api.user.service.UserDetailsService;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/user")
public class UserController {

    private final RegistrationService registrationService;
    private final UserDetailsService userDetailsService;

    @PostMapping
    public ResponseEntity<String> register(@RequestBody @Valid RegistrationRequest request) {
        return registrationService.register(request);
    }
    @GetMapping
    public ResponseEntity<String> activateAccount(@RequestParam String activationCode, HttpServletResponse response, HttpServletRequest request){
        return registrationService.activateAccount(activationCode,response,request);
    }
    @GetMapping("details")
    public AppUserDTO getUserDetails(HttpServletRequest request){
        String userName = request.getUserPrincipal().getName();
        return userDetailsService.getUserDetails(userName);
    }
}
