package pl.motobudzet.api.infrastructure.thymeleaf;

import org.springframework.security.core.Authentication;
import org.springframework.ui.Model;

public class ViewModelUtils {

    private ViewModelUtils() {
    }

    private static final String USER_LOGGED_PARAMETER = "username";
    private static final String USER_NOT_LOGGED_BUTTON_VALUE = "ZALOGUJ";
    public static final String ROLE_PARAMETER = "ROLE";
    public static final String ROLE_PARAMETER_VALUE = "ROLE_ADMIN";

    public static void setAuthenticationAttributes(Model model, Authentication authentication) {
        if (authentication != null) {
            model.addAttribute(USER_LOGGED_PARAMETER, authentication.getName());

            if (isAdmin(authentication)) {
                model.addAttribute(ROLE_PARAMETER, ROLE_PARAMETER_VALUE);
            }

        } else {
            model.addAttribute(USER_LOGGED_PARAMETER, USER_NOT_LOGGED_BUTTON_VALUE);
        }
    }

    private static boolean isAdmin(Authentication authentication) {
        return authentication
                .getAuthorities()
                .stream()
                .anyMatch(authority -> authority.getAuthority().equals(ROLE_PARAMETER_VALUE));
    }

}
