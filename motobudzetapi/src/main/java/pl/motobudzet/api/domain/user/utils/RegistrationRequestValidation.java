package pl.motobudzet.api.domain.user.utils;

import pl.motobudzet.api.persistance.AppUserRepository;
import pl.motobudzet.api.domain.user.dto.RegistrationRequest;


public class RegistrationRequestValidation {

    private RegistrationRequestValidation() {
    }

    public static String validate(RegistrationRequest request, AppUserRepository userRepository) {

        String result = userRepository.checkUsernameAndEmailAvailability(request.getUserName(), request.getEmail());

        switch (result) {
            case "Username is already taken" -> result = "Nazwa użytkownika jest już zajęta!";
            case "Email is already taken" -> result = "Podany adres email jest już zajęty!";
            default -> result = "Both username and email are available";
        }
        return result;
    }
}
