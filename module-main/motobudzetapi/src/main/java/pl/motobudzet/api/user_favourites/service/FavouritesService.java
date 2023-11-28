package pl.motobudzet.api.user_favourites.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.user.entity.AppUser;
import pl.motobudzet.api.user.service.AppUserCustomService;
import pl.motobudzet.api.user_favourites.dto.FavouriteRequest;
import pl.motobudzet.api.user_favourites.entity.Favourite;
import pl.motobudzet.api.user_favourites.repository.FavouritesRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static pl.motobudzet.api.utils.mappers.FavouriteMapper.mapToFavouriteDTO;

@Service
@RequiredArgsConstructor
public class FavouritesService {

    private final FavouritesRepository favouritesRepository;
    private final AppUserCustomService appUserCustomService;

    public String manageUserFavourite(FavouriteRequest request, String loggedUser) {

        AppUser appUser = appUserCustomService.getUserByName(loggedUser);
        Optional<Favourite> existingFavourite = favouritesRepository.findByUserAndAdvertisementId(appUser, request.getAdvertisementId());

            if(existingFavourite.isEmpty()){
                favouritesRepository.save(mapToFavouriteDTO(request, appUser));
                return "Dodano do ulubionych";
            } else {
                favouritesRepository.delete(existingFavourite.get());
                return "Usunieto z ulubionych";
            }
    }

    public boolean checkIsFavourite(String userName, String advertisementId, String loggedUser){
        if(loggedUser.equals(userName)){
            return favouritesRepository.checkIsFavourite(userName, advertisementId);
        }
        return false;
    }

    public List<UUID> getAllFavouritesId(String principalName) {
         return favouritesRepository.findAllFavouritesIdByUserName(principalName);
    }
}
