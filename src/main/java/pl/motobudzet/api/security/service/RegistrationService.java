package pl.motobudzet.api.security.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.security.util.RequestCredentialsValidation;
import pl.motobudzet.api.user.dto.RegistrationRequest;
import pl.motobudzet.api.user.entity.AppUser;
import pl.motobudzet.api.user.entity.Role;
import pl.motobudzet.api.user.repository.AppUserRepository;
import pl.motobudzet.api.user.repository.RoleRepository;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final AppUserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RequestCredentialsValidation requestCredentialsValidation;
    private final PasswordEncoder passwordEncoder;

    public ResponseEntity<String> register(RegistrationRequest request) {

        requestCredentialsValidation.validate(request);

        AppUser newUser = AppUser.builder()
                .userName(request.getUserName())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .accountEnabled(true)
                .accountNotLocked(true)
                .accountNotExpired(true)
                .credentialsNotExpired(true)
                .roles(List.of(roleRepository.findByName("ROLE_ADMIN").get()))
                .build();
            userRepository.saveAndFlush(newUser);

        return ResponseEntity.ok().header("Location",newUser.getId().toString()).body("Registered !");
    }

//    private Collection < ? extends GrantedAuthority> mapRolesToAuthorities(Collection <Role> roles) {
//        return roles.stream()
//                .map(role -> new SimpleGrantedAuthority(role.getName()))
//                .collect(Collectors.toList());
//    }
}
