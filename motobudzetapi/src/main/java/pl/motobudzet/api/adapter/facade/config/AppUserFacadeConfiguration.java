package pl.motobudzet.api.adapter.facade.config;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.motobudzet.api.adapter.facade.EmailManagerFacade;
import pl.motobudzet.api.adapter.facade.LocationFacade;
import pl.motobudzet.api.adapter.facade.AppUserFacade;
import pl.motobudzet.api.domain.user.service.FactoryUserService;
import pl.motobudzet.api.domain.user.service.RegistrationService;
import pl.motobudzet.api.domain.user.service.UserService;
import pl.motobudzet.api.infrastructure.configuration.security.JwtService;
import pl.motobudzet.api.persistance.AppUserRepository;

@Configuration
@AllArgsConstructor
class AppUserFacadeConfiguration {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailManagerFacade mailService;
    private final LocationFacade locationFacade;
    private final JwtService jwtService;

    @Bean
    public AppUserFacade appUserFacade() {

        RegistrationService registrationService =
                FactoryUserService.createRegistrationService(userRepository,passwordEncoder,mailService,jwtService);

        UserService userService =
                FactoryUserService.createUserService(userRepository,passwordEncoder,mailService,locationFacade,jwtService);

        return new AppUserFacade(userService,registrationService);
    }
}
