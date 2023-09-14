package pl.motobudzet.api.utils;

import pl.motobudzet.api.user.dto.RegistrationRequest;
import pl.motobudzet.api.user.repository.AppUserRepository;



public class RegistrationRequestValidation {

    private RegistrationRequestValidation() {
    }

    public static String validate(RegistrationRequest request, AppUserRepository userRepository) {

        String result = userRepository.checkUsernameAndEmailAvailability(request.getUserName(), request.getEmail());

        switch (result) {
            case "Username is already taken" -> result = "Nazwa użytkownika jest już zajęta!";
            case "Email is already taken" -> result = "Podany adres email jest już zajęty!";
        }
        return result;
    }
}
