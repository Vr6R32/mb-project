package pl.motobudzet.api.user_favourites.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseBody;
import pl.motobudzet.api.user.entity.AppUser;
import pl.motobudzet.api.user.service.AppUserCustomService;
import pl.motobudzet.api.user_favourites.dto.FavouriteRequest;
import pl.motobudzet.api.user_favourites.entity.Favourite;
import pl.motobudzet.api.user_favourites.repository.FavouritesRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FavouritesService {

    private final FavouritesRepository favouritesRepository;
    private final AppUserCustomService appUserCustomService;

    public String manageUserFavourite(FavouriteRequest request, String loggedUser) {

        AppUser appUser = authorizeUser(request, loggedUser);
        Optional<Favourite> existingFavourite = favouritesRepository.findByUserAndAdvertisementId(appUser, request.getAdvertisementId());

            if(existingFavourite.isEmpty()){
                favouritesRepository.save(buildFavourite(request, appUser));
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

    private Favourite buildFavourite(FavouriteRequest request, AppUser appUser) {
        return Favourite.builder()
                .appUser(appUser)
                .advertisementId(request.getAdvertisementId())
                .userName(appUser.getUsername())
                .build();
    }

    private AppUser authorizeUser(FavouriteRequest request,String loggedUser) {
        AppUser user = appUserCustomService.getByName(loggedUser);
        if(request.getUserName().equals(user.getUsername())){
            return  user;
        }
        throw new RuntimeException("not authorized");
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
