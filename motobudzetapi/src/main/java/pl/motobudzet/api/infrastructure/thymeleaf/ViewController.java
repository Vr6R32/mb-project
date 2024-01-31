package pl.motobudzet.api.infrastructure.thymeleaf;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;

import static pl.motobudzet.api.infrastructure.thymeleaf.NumberFormatter.formatNumber;

@Controller
@RequiredArgsConstructor
public class ViewController {

    public static final String PHOTO_RESOURCE_URL = "https://motobudzet.pl/api/static/photo/";
    private final MetaDataService metaService;


    @GetMapping("/")
    public String index(Model model, Authentication authentication) {
        ViewModelConfig.setAuthenticationAttributes(model, authentication);
        return "index";
    }

    @GetMapping("advertisement")
    public String showAdvertisementDetailsPage(@RequestParam UUID id, Model model, Authentication authentication) {
        ViewModelConfig.setAuthenticationAttributes(model, authentication);

        MetaDataDTO metadata = metaService.findMetaDataForAdvertisementById(id);
        model.addAttribute("ogImage", PHOTO_RESOURCE_URL + metadata.miniatureUrl());
        model.addAttribute("ogTitle", metadata.title() + " " + formatNumber(metadata.price()) + " " + metadata.priceUnit() + ", " +
                formatNumber(metadata.mileage()) + " " + String.valueOf(metadata.mileageUnit()).toLowerCase());

        model.addAttribute("ogDescription", "motobudzet.pl - Darmowe ogloszenia motoryzacyjne");
        return "advertisement";
    }

    @GetMapping("advertisement/new")
    public String createForm(Model model, Authentication authentication) {
        ViewModelConfig.setAuthenticationAttributes(model, authentication);
        return "createForm";
    }

    @GetMapping("advertisement/edit")
    public String editForm(Model model, Authentication authentication) {
        ViewModelConfig.setAuthenticationAttributes(model, authentication);
        return "editForm";
    }

    @GetMapping("login")
    public String loginPage(Model model, Authentication authentication) {
        ViewModelConfig.setAuthenticationAttributes(model, authentication);
        return "login";
    }

    @GetMapping("account")
    public String accountProfile(Model model, Authentication authentication) {
        ViewModelConfig.setAuthenticationAttributes(model, authentication);
        model.addAttribute("loadFunction", "Profil");
        return "account";
    }

    @GetMapping("messages")
    public String messages(Model model, Authentication authentication) {
        ViewModelConfig.setAuthenticationAttributes(model, authentication);
        model.addAttribute("loadFunction", "Wiadomosci");
        return "account";
    }

    @GetMapping("favourites")
    public String favourites(Model model, Authentication authentication) {
        ViewModelConfig.setAuthenticationAttributes(model, authentication);
        model.addAttribute("loadFunction", "Ulubione");
        return "account";
    }

    @GetMapping("advertisements")
    public String advertisements(Model model, Authentication authentication) {
        ViewModelConfig.setAuthenticationAttributes(model, authentication);
        model.addAttribute("loadFunction", "Ogloszenia");
        return "account";
    }

    @GetMapping("reset")
    public String resetPassword(Model model, Authentication authentication) {
        ViewModelConfig.setAuthenticationAttributes(model, authentication);
        return "reset";
    }

    @GetMapping("user/details")
    public String setUserDetails(Model model, Authentication authentication) {
        ViewModelConfig.setAuthenticationAttributes(model, authentication);
        return "details";
    }

    @GetMapping("management")
    public String managementPage(Model model, Authentication authentication) {
        ViewModelConfig.setAuthenticationAttributes(model, authentication);
        model.addAttribute("loadFunction", "Management");
        return "management";
    }


    @GetMapping("stream")
    public String stream(Model model, Authentication authentication) {
        ViewModelConfig.setAuthenticationAttributes(model, authentication);
        return "stream";
    }
}
