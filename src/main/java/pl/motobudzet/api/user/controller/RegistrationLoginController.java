package pl.motobudzet.api.user.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.motobudzet.api.security.service.RegistrationService;
import pl.motobudzet.api.user.dto.RegistrationRequest;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/user")
public class RegistrationLoginController {

    private final RegistrationService registrationService;

    @PostMapping
    public ResponseEntity<String> register(@RequestBody @Valid RegistrationRequest request){
        System.out.println(request);
        return registrationService.register(request);
    }
}
