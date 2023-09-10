package pl.motobudzet.api.frontend;

import org.springframework.ui.Model;

import java.security.Principal;

public class ModelUtils {

    private static final String LOGOUT_BUTTON = "logout";
    private static final String LOGOUT_BUTTON_VALUE = "WYLOGUJ";
    private static final String USER_LOGGED_BUTTON = "principalName";
    private static final String USER_NOT_LOGGED_BUTTON_VALUE = "KONTO";

    public static void setButtonsAttributes(Model model, Principal principal) {
        if (principal != null) {
            model.addAttribute(USER_LOGGED_BUTTON, principal.getName());
            model.addAttribute(LOGOUT_BUTTON, LOGOUT_BUTTON_VALUE);
        } else {
            model.addAttribute(USER_LOGGED_BUTTON, USER_NOT_LOGGED_BUTTON_VALUE);
        }
    }
}
