package pl.motobudzet.api.utils.mappers;

import pl.motobudzet.api.user.entity.AppUser;
import pl.motobudzet.api.user_favourites.dto.FavouriteRequest;
import pl.motobudzet.api.user_favourites.entity.Favourite;

public class FavouriteMapper {
    private FavouriteMapper() {
    }

    public static Favourite mapToFavouriteDTO(FavouriteRequest request, AppUser appUser) {
        return Favourite.builder()
                .appUser(appUser)
                .advertisementId(request.getAdvertisementId())
                .userName(appUser.getUsername())
                .build();
    }

}
