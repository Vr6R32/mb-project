package pl.motobudzet.api.user_favourites;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.user.entity.AppUser;
import pl.motobudzet.api.user.service.AppUserCustomService;


import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FavouritesService {

    private final FavouritesRepository favouritesRepository;
    private final AppUserCustomService appUserCustomService;

    public String manageUserFavourite(FavouriteRequest request, String loggedUser) {


        AppUser appUser = getUser(loggedUser);
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

    private Favourite mapToFavouriteDTO(FavouriteRequest request, AppUser appUser) {
        return Favourite.builder()
                .appUser(appUser)
                .advertisementId(request.getAdvertisementId())
                .userName(appUser.getUsername())
                .build();
    }

    private AppUser getUser(String loggedUser) {
        return appUserCustomService.getUserByName(loggedUser);

    }

    public int getAllFavourites(String loggedUser, String principalName) {
        if(loggedUser.equals(principalName)){
           return favouritesRepository.findAllFavouritesByUserName(loggedUser);
        }
        return 0;
    }

    public List<UUID> getAllFavouritesId(String loggedUser, String principalName) {
        if(loggedUser.equals(principalName)){
            return favouritesRepository.findAllFavouritesIdByUserName(loggedUser);
        }
        return List.of(null);
    }
}
