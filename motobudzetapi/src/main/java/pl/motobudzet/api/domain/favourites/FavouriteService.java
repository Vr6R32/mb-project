package pl.motobudzet.api.domain.favourites;

import pl.motobudzet.api.domain.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.domain.user.entity.AppUser;

import java.util.List;
import java.util.UUID;

public interface FavouriteService {
    String manageUserFavourite(FavouriteRequest request, AppUser loggedUser);
    boolean checkIsFavourite(String advertisementId, String loggedUser);
    List<UUID> getUserFavouriteAdvertisementIds(String loggedUser);
    List<AdvertisementDTO> getUserFavouriteAdvertisements(String loggedUser);
}