package pl.motobudzet.api.infrastructure.configuration.security.authentication;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/authenticate")
    @Operation(summary = "Authenticate user and generate token",
            description = "This endpoint is used for user authentication. Once authenticated, the token is automatically stored in the HTTP cookie.There is no need to pass token into the OpenAPI Security Scheme.")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest credentials, HttpServletResponse response) {
        return authenticationService.authenticate(credentials,response);
    }
}