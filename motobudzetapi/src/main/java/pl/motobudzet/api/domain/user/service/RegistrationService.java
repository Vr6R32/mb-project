package pl.motobudzet.api.domain.user.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import pl.motobudzet.api.domain.user.dto.RegistrationRequest;

public interface RegistrationService {

    ResponseEntity<String> register(RegistrationRequest request);
    void confirmEmail(String registrationCode, HttpServletResponse response, HttpServletRequest request);
}
