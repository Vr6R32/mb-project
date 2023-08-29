package pl.motobudzet.api.security.util;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import pl.motobudzet.api.user.dto.RegistrationRequest;
import pl.motobudzet.api.user.repository.AppUserRepository;
import pl.motobudzet.api.user.repository.RoleRepository;


@RequiredArgsConstructor
@Component
public class RequestCredentialsValidation {

    private final AppUserRepository userRepository;
    private final RoleRepository roleRepository;

    public void validate(RegistrationRequest request){

        boolean isPresentEmail = userRepository.findByEmail(request.getEmail()).isPresent();
        boolean isPresentName = userRepository.findByUserName(request.getUserName()).isPresent();

        if(isPresentName){
            throw new RuntimeException("Username is already taken !");
        }
        else if (isPresentEmail){
            throw new RuntimeException("Email is already taken !");
        }
    }
}
