package pl.motobudzet.api.security.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.utils.RegistrationRequestValidation;
import pl.motobudzet.api.user.dto.RegistrationRequest;
import pl.motobudzet.api.user.entity.AppUser;
import pl.motobudzet.api.user.repository.AppUserRepository;
import pl.motobudzet.api.user.repository.RoleRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final AppUserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public ResponseEntity<String> register(RegistrationRequest request) {

        RegistrationRequestValidation.validate(request,userRepository);

        AppUser newUser = AppUser.builder()
                .userName(request.getUserName())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .accountEnabled(true)
                .accountNotLocked(true)
                .accountNotExpired(true)
                .credentialsNotExpired(true)
                .roles(List.of(roleRepository.findByName("ROLE_ADMIN").orElseThrow(() -> new RuntimeException("Role not found!"))))
                .build();
        userRepository.saveAndFlush(newUser);

        return ResponseEntity.ok().header("Location", newUser.getId().toString()).body("Registered !");
    }
}
