package pl.motobudzet.api.user_favourites;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import pl.motobudzet.api.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.user_account.entity.AppUser;

import java.util.List;

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

    @GetMapping
    public ResponseEntity<Boolean> checkIsFavourite(@RequestParam String advertisementId, Authentication authentication) {
        boolean response = favouritesService.checkIsFavourite(advertisementId, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("all")
    public List<AdvertisementDTO> getFavouritesIds(Authentication authentication) {
        return favouritesService.getAllFavouritesAdvertisements(authentication.getName());
    }
}
