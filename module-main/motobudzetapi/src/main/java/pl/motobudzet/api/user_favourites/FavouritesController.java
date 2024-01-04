package pl.motobudzet.api.user_favourites;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping(value = "api/users/favourites")
public class FavouritesController {

    private final FavouritesService favouritesService;

    @PostMapping
    public String manageUserFavourite(@RequestBody FavouriteRequest userRequest,
                                                      Principal principal){
        return favouritesService.manageUserFavourite(userRequest, principal.getName());

    }
    @GetMapping
    public ResponseEntity<String> checkIsFavourite(@RequestParam String userName,
                                                   @RequestParam String advertisementId,
                                                   Principal principal){
        String response = String.valueOf(favouritesService.checkIsFavourite(userName,advertisementId, principal.getName()));
        return ResponseEntity.ok(response);
    }

    @GetMapping("{loggedUser}")
    public List<UUID> getFavouritesIds(@PathVariable String loggedUser,
                                       Principal principal) {
        return favouritesService.getAllFavouritesId(loggedUser, principal.getName());
    }
}
