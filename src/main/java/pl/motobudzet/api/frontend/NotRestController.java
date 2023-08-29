package pl.motobudzet.api.frontend;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.security.Principal;

@Controller
public class NotRestController {


    @GetMapping("/")
    public String index(Model model, Principal principal) {
        ModelUtils.setButtonsAttributes(model,principal);
        return "index";
    }

//    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @GetMapping("messages")
    public String messages(Model model, Principal principal) {
        ModelUtils.setButtonsAttributes(model,principal);
        return "messages";
    }

    @GetMapping("/id/{advertisementId}")
    public String advertisement(@PathVariable String advertisementId, Model model, Principal principal) {
        ModelUtils.setButtonsAttributes(model,principal);
        return "advertisement";
    }

    @GetMapping("advertisement/new")
//    @PreAuthorize("isAuthenticated()")
    public String createForm(Model model, Principal principal) {
        ModelUtils.setButtonsAttributes(model,principal);
        return "createForm";
    }

    @GetMapping("login")
    public String loginPage(Model model, Principal principal) {
        ModelUtils.setButtonsAttributes(model,principal);
        return "login";
    }

    @GetMapping("loginTest")
    public String loginTest(Model model, Principal principal) {
        ModelUtils.setButtonsAttributes(model,principal);
        return "loginTest";
    }

    @GetMapping("account")
    public String accountProfile(Model model, Principal principal) {
        ModelUtils.setButtonsAttributes(model,principal);
        return "account";
    }
    @GetMapping("register")
    public String register(Model model, Principal principal) {
        ModelUtils.setButtonsAttributes(model,principal);
        return "register";
    }

}
