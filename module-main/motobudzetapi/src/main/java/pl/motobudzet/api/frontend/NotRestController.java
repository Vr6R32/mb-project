package pl.motobudzet.api.frontend;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.security.Principal;

@Controller
public class NotRestController {


    @GetMapping("/")
    public String index(Model model, Principal principal) {
        ModelUtils.setButtonsAttributes(model, principal);
        return "index";
    }

    //    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/id")
    public String advertisement(@RequestParam String advertisementId, Model model, Principal principal) {
        ModelUtils.setButtonsAttributes(model, principal);
        return "advertisement";
    }

    @GetMapping("advertisement/new")
    public String createForm(Model model, Principal principal) {
        ModelUtils.setButtonsAttributes(model, principal);
        return "createForm";
    }

    @GetMapping("advertisement/edit")
    public String editForm(Model model, Principal principal,@RequestParam("advertisementId") String advertisementId) {
        ModelUtils.setButtonsAttributes(model, principal);
        return "editForm";
    }

    @GetMapping("login")
    public String loginPage(Model model, Principal principal) {
        ModelUtils.setButtonsAttributes(model, principal);
        return "login";
    }

    @GetMapping("account")
    public String accountProfile(Model model, Principal principal) {
        ModelUtils.setButtonsAttributes(model, principal);
        model.addAttribute("loadFunction", "Profil");
        return "account";
    }

    @GetMapping("messages")
    public String messages(Model model, Principal principal) {
        ModelUtils.setButtonsAttributes(model, principal);
        model.addAttribute("loadFunction", "Wiadomosci");
        return "account";
    }

    @GetMapping("favourites")
    public String favourites(Model model, Principal principal) {
        ModelUtils.setButtonsAttributes(model, principal);
        model.addAttribute("loadFunction", "Ulubione");
        return "account";
    }
}
