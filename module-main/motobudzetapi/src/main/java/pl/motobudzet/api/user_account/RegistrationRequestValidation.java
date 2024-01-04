package pl.motobudzet.api.user_account;

import pl.motobudzet.api.user_account.dto.RegistrationRequest;
import pl.motobudzet.api.user_account.repository.AppUserRepository;



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
