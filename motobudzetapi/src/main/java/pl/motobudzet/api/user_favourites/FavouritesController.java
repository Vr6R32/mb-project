package pl.motobudzet.api.user_favourites;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.motobudzet.api.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.user_account.entity.AppUser;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "api/users/favourites")
public class FavouritesController {

    private final FavouritesService favouritesService;

    @PostMapping
    public String manageUserFavourite(@RequestBody FavouriteRequest userRequest, Authentication authentication) {
        AppUser user = (AppUser) authentication.getPrincipal();
        return favouritesService.manageUserFavourite(userRequest, user);
    }
    @GetMapping("ids")
    public List<UUID> getUserFavouriteAdvertisementIds(Authentication authentication) {
        return favouritesService.getUserFavouriteAdvertisementIds(authentication.getName());
    }
    @GetMapping("advertisements")
    public List<AdvertisementDTO> getUserFavouriteAdvertisements(Authentication authentication) {
        return favouritesService.getUserFavouriteAdvertisements(authentication.getName());
    }

    @GetMapping
    public boolean checkIsFavourite(@RequestParam String advertisementId,Authentication authentication) {
        return favouritesService.checkIsFavourite(advertisementId,authentication.getName());
    }
}
