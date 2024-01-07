package pl.motobudzet.api.user_favourites;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.advertisement.repository.AdvertisementRepository;
import pl.motobudzet.api.user_account.entity.AppUser;
import pl.motobudzet.api.user_account.service.AppUserCustomService;


import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static pl.motobudzet.api.advertisement.service.UserAdvertisementService.mapToAdvertisementDTO;

@Service
@RequiredArgsConstructor
public class FavouritesService {

    private final FavouritesRepository favouritesRepository;
    private final AppUserCustomService appUserCustomService;
    private final AdvertisementRepository advertisementRepository;

    public String manageUserFavourite(FavouriteRequest request, AppUser loggedUser) {

        Optional<Favourite> existingFavourite = favouritesRepository.findByUserAndAdvertisementId(loggedUser, request.getAdvertisementId());

            if(existingFavourite.isEmpty()){
                favouritesRepository.save(mapToFavouriteDTO(request, loggedUser));
                return "Dodano do ulubionych";
            } else {
                favouritesRepository.delete(existingFavourite.get());
                return "Usunieto z ulubionych";
            }
    }

    public boolean checkIsFavourite(String advertisementId, String loggedUser){
            return favouritesRepository.checkIsFavourite(loggedUser, advertisementId);
    }

    private Favourite mapToFavouriteDTO(FavouriteRequest request, AppUser appUser) {
        return Favourite.builder()
                .appUser(appUser)
                .advertisementId(request.getAdvertisementId())
                .userName(appUser.getUsername())
                .build();
    }

    public List<AdvertisementDTO> getAllFavouritesAdvertisements(String loggedUser) {
        List<UUID> favouritesList = favouritesRepository.findAllFavouritesIdByUserName(loggedUser);
        return advertisementRepository.getAllAdvertisementsByListOfIds(favouritesList).stream()
                .map(advertisement -> mapToAdvertisementDTO(advertisement, false)).toList();
        }
}
