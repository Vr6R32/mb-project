package pl.motobudzet.api.frontend;

import org.springframework.ui.Model;

import java.security.Principal;

public class ModelUtils {

    private static final String USER_NAME = "principalName";
    private static final String LOGOUT_BUTTON = "logout";
    private static final String LOGOUT_BUTTON_VALUE = "WYLOGUJ";
    private static final String USER_NOT_LOGGED_VALUE = "KONTO";

    public static void setButtonsAttributes(Model model, Principal principal) {
        if (principal != null) {
            model.addAttribute(USER_NAME, principal.getName());
            model.addAttribute(LOGOUT_BUTTON, LOGOUT_BUTTON_VALUE);
        } else {
            model.addAttribute(USER_NAME, USER_NOT_LOGGED_VALUE);
        }
    }
}
