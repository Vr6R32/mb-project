package pl.motobudzet.api.thymeleaf;

import org.springframework.ui.Model;

import java.security.Principal;

public class ModelUtils {

    private static final String USER_LOGGED_BUTTON = "username";
    private static final String USER_NOT_LOGGED_BUTTON_VALUE = "ZALOGUJ";

    public static void setButtonsAttributes(Model model, Principal principal) {
        if (principal != null) {
            model.addAttribute(USER_LOGGED_BUTTON, principal.getName());
        } else {
            model.addAttribute(USER_LOGGED_BUTTON, USER_NOT_LOGGED_BUTTON_VALUE);
        }
    }
}
