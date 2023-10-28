package pl.motobudzet.api.user_favourites.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.motobudzet.api.user_favourites.dto.FavouriteRequest;
import pl.motobudzet.api.user_favourites.service.FavouritesService;

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
//    @GetMapping
//    public ResponseEntity<String> checkIsFavourite(@RequestBody FavouriteRequest userRequest,
//                                                      Principal principal){
//        String response = String.valueOf(favouritesService.checkIsFavourite(userRequest, principal.getName()));
//        System.out.println(response);
//        return ResponseEntity.ok(response);
//    }
    @GetMapping
    public ResponseEntity<String> checkIsFavourite(@RequestParam String userName,
                                                   @RequestParam String advertisementId,
                                                   Principal principal){
        String response = String.valueOf(favouritesService.checkIsFavourite(userName,advertisementId, principal.getName()));
        System.out.println(response);
        return ResponseEntity.ok(response);
    }
//    @GetMapping("{loggedUser}")
//    public ResponseEntity<String> getFavourites(@PathVariable String loggedUser,
//                                                Principal principal) {
//        int allFavourites = favouritesService.getAllFavourites(loggedUser, principal.getName());
//        return ResponseEntity.ok(String.valueOf(allFavourites));
//    }
    @GetMapping("{loggedUser}")
    public List<UUID> getFavouritesIds(@PathVariable String loggedUser,
                                       Principal principal) {
        return favouritesService.getAllFavouritesId(loggedUser, principal.getName());
    }
}
