package pl.motobudzet.api.adapter.facade;


import lombok.AllArgsConstructor;
import pl.motobudzet.api.dto.AdvertisementDTO;
import pl.motobudzet.api.domain.favourites.FavouriteRequest;
import pl.motobudzet.api.domain.favourites.FavouriteService;
import pl.motobudzet.api.domain.user.entity.AppUser;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
public class FavouriteFacade {

    private final FavouriteService favouriteService;

    public String manageUserFavourite(FavouriteRequest request, AppUser loggedUser) {
        return favouriteService.manageUserFavourite(request, loggedUser);
    }
    public boolean checkIsFavourite(String advertisementId, String loggedUser) {
        return favouriteService.checkIsFavourite(advertisementId, loggedUser);
    }
    public List<UUID> getUserFavouriteAdvertisementIds(String loggedUser) {
        return favouriteService.getUserFavouriteAdvertisementIds(loggedUser);
    }
    public List<AdvertisementDTO> getUserFavouriteAdvertisements(String loggedUser) {
        return favouriteService.getUserFavouriteAdvertisements(loggedUser);
    }

}
