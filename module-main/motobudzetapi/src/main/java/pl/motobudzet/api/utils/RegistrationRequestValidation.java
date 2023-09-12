package pl.motobudzet.api.utils;

import pl.motobudzet.api.user.dto.RegistrationRequest;
import pl.motobudzet.api.user.repository.AppUserRepository;



public class RegistrationRequestValidation {

    private RegistrationRequestValidation() {
    }

    public static void validate(RegistrationRequest request, AppUserRepository userRepository) {

        String result = userRepository.checkUsernameAndEmailAvailability(request.getUserName(), request.getEmail());

        switch (result) {
            case "Username is already taken" -> throw new RuntimeException("Username is already taken!");
            case "Email is already taken" -> throw new RuntimeException("Email is already taken!");
            case "Both username and email are available" -> {
            }
        }
    }
}
