package pl.motobudzet.api.user_account.utils;

import pl.motobudzet.api.user_account.AppUserRepository;
import pl.motobudzet.api.user_account.dto.RegistrationRequest;


public class RegistrationRequestValidation {

    private RegistrationRequestValidation() {
    }

    public static String validate(RegistrationRequest request, AppUserRepository userRepository) {

        String result = userRepository.checkUsernameAndEmailAvailability(request.getUserName(), request.getEmail());

        switch (result) {
            case "Username is already taken" -> result = "Nazwa użytkownika jest już zajęta!";
            case "Email is already taken" -> result = "Podany adres email jest już zajęty!";
            default -> result = "Something went wrong";
        }
        return result;
    }
}
