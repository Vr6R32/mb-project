package pl.motobudzet.api.adapter.facade.config;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pl.motobudzet.api.adapter.facade.FavouriteFacade;
import pl.motobudzet.api.domain.favourites.FactoryFavouriteService;
import pl.motobudzet.api.domain.favourites.FavouriteService;
import pl.motobudzet.api.persistance.AdvertisementRepository;
import pl.motobudzet.api.persistance.FavouritesRepository;

@Configuration
@AllArgsConstructor
class FavouriteFacadeConfiguration {

    private final FavouritesRepository favouritesRepository;
    private final AdvertisementRepository advertisementRepository;

    @Bean
    public FavouriteFacade favouriteFacade() {
        FavouriteService favouriteService = FactoryFavouriteService.createFavouriteService(favouritesRepository,advertisementRepository);
        return new FavouriteFacade(favouriteService);
    }


}
