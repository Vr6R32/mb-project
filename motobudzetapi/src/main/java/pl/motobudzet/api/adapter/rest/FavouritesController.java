package pl.motobudzet.api.adapter.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.motobudzet.api.adapter.facade.FavouriteFacade;
import pl.motobudzet.api.dto.AdvertisementDTO;
import pl.motobudzet.api.domain.favourites.FavouriteRequest;
import pl.motobudzet.api.domain.user.entity.AppUser;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "api/users/favourites")
public class FavouritesController {

    private final FavouriteFacade favouriteFacade;

    @PostMapping
    public String manageUserFavourite(@RequestBody FavouriteRequest userRequest, Authentication authentication) {
        AppUser user = (AppUser) authentication.getPrincipal();
        return favouriteFacade.manageUserFavourite(userRequest, user);
    }
    @GetMapping("ids")
    public List<UUID> getUserFavouriteAdvertisementIds(Authentication authentication) {
        return favouriteFacade.getUserFavouriteAdvertisementIds(authentication.getName());
    }
    @GetMapping("advertisements")
    public List<AdvertisementDTO> getUserFavouriteAdvertisements(Authentication authentication) {
        return favouriteFacade.getUserFavouriteAdvertisements(authentication.getName());
    }

    @GetMapping
    public boolean checkIsFavourite(@RequestParam String advertisementId,Authentication authentication) {
        return favouriteFacade.checkIsFavourite(advertisementId,authentication.getName());
    }
}
