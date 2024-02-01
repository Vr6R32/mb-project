package pl.motobudzet.api.domain.favourites;

import pl.motobudzet.api.persistance.AdvertisementRepository;
import pl.motobudzet.api.persistance.FavouritesRepository;

public class FactoryFavouriteService {

    private FactoryFavouriteService() {
    }

    public static FavouriteService createFavouriteService(FavouritesRepository favouritesRepository, AdvertisementRepository advertisementRepository) {
        return new FavouritesServiceImpl(favouritesRepository, advertisementRepository);
    }
}
