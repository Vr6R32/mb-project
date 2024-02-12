package pl.motobudzet.api.domain.user.service;


import org.springframework.security.crypto.password.PasswordEncoder;
import pl.motobudzet.api.adapter.facade.EmailManagerFacade;
import pl.motobudzet.api.adapter.facade.LocationFacade;
import pl.motobudzet.api.infrastructure.configuration.security.JwtService;
import pl.motobudzet.api.persistance.AppUserRepository;

public class FactoryUserService {


    private FactoryUserService() {
    }

    public static RegistrationService createRegistrationService(AppUserRepository userRepository, PasswordEncoder passwordEncoder,
                                                                EmailManagerFacade emailManagerFacade, JwtService jwtService) {

        return new RegistrationServiceImpl(userRepository,passwordEncoder,emailManagerFacade,jwtService);
    }
    public static UserService createUserService(AppUserRepository userRepository, PasswordEncoder passwordEncoder,
                                                                EmailManagerFacade emailManagerFacade,LocationFacade locationFacade, JwtService jwtService) {

        return new UserServiceImpl(userRepository,passwordEncoder,emailManagerFacade,locationFacade,jwtService);
    }
}
