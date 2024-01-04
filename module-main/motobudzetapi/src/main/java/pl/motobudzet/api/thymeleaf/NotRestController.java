package pl.motobudzet.api.thymeleaf;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import pl.motobudzet.api.user_account.service.AppUserCustomService;

import java.security.Principal;
import java.util.UUID;

import static pl.motobudzet.api.utils.NumberFormatter.formatNumber;

@Controller
@RequiredArgsConstructor
public class NotRestController {

    public static final String PHOTO_RESOURCE_URL = "https://motobudzet.pl/api/static/photo/";
    private final MetaDataService metaService;


    @GetMapping("/")
    public String index(Model model, Principal principal) {
        ModelUtils.setButtonsAttributes(model, principal);
        return "index";
    }

    @GetMapping("advertisement")
    public String showAdvertisementDetailsPage(@RequestParam UUID id, Model model, Principal principal) {
        ModelUtils.setButtonsAttributes(model, principal);
        MetaDataDTO metadata = metaService.findMetaDataForAdvertisementById(id);
        model.addAttribute("ogImage", PHOTO_RESOURCE_URL + metadata.miniatureUrl());
        model.addAttribute("ogTitle", metadata.title());
        model.addAttribute("ogDescription",

                formatNumber(metadata.price()) + " " + metadata.priceUnit() + ", " +
                            formatNumber(metadata.mileage()) + " " + String.valueOf(metadata.mileageUnit()).toLowerCase());
        return "advertisement";
    }

    @GetMapping("advertisement/new")
    public String createForm(Model model, Principal principal) {
        ModelUtils.setButtonsAttributes(model, principal);
        return "createForm";
    }

    @GetMapping("advertisement/edit")
    public String editForm(Model model, Principal principal,@RequestParam("id") String id) {
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
    @GetMapping("advertisements")
    public String advertisements(Model model, Principal principal) {
        ModelUtils.setButtonsAttributes(model, principal);
        model.addAttribute("loadFunction", "Ogloszenia");
        return "account";
    }

    @GetMapping("reset")
    public String resetPassword(Model model, Principal principal) {
        ModelUtils.setButtonsAttributes(model, principal);
        return "reset";
    }

    @GetMapping("user/details")
    public String setUserDetails(Model model, Principal principal) {
        ModelUtils.setButtonsAttributes(model, principal);
        return "details";
    }
    @GetMapping("stream")
    public String stream(Model model, Principal principal) {
        ModelUtils.setButtonsAttributes(model, principal);
        return "stream";
    }
}
