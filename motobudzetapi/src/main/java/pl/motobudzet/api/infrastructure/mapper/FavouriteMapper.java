package pl.motobudzet.api.infrastructure.mapper;

import pl.motobudzet.api.domain.favourites.Favourite;
import pl.motobudzet.api.domain.favourites.FavouriteRequest;
import pl.motobudzet.api.domain.user.AppUser;

public class FavouriteMapper {

    private FavouriteMapper() {
    }

    public static Favourite mapFavouriteRequestToEntity(FavouriteRequest request, AppUser appUser) {
        return Favourite.builder()
                .appUser(appUser)
                .advertisementId(request.advertisementId())
                .userName(appUser.getUsername())
                .build();
    }
}
