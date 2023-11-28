package pl.motobudzet.api.utils;


public class RegistrationRequestValidation {

    private RegistrationRequestValidation() {
    }

    public static String validateRegistrationRequest(String result) {

        switch (result) {
            case "Username is already taken" -> result = "Nazwa użytkownika jest już zajęta!";
            case "Email is already taken" -> result = "Podany adres email jest już zajęty!";
        }
        return result;
    }
}
