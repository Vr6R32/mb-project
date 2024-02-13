package pl.motobudzet.api.domain.favourites;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import pl.motobudzet.api.domain.user.entity.AppUser;
import pl.motobudzet.api.dto.AdvertisementDTO;
import pl.motobudzet.api.persistance.AdvertisementRepository;
import pl.motobudzet.api.persistance.FavouritesRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static pl.motobudzet.api.infrastructure.mapper.AdvertisementMapper.mapToAdvertisementDTO;
import static pl.motobudzet.api.infrastructure.mapper.FavouriteMapper.mapFavouriteRequestToEntity;

@Slf4j
@RequiredArgsConstructor
public class FavouritesServiceImpl implements FavouriteService {

    private final FavouritesRepository favouritesRepository;
    private final AdvertisementRepository advertisementRepository;

    public String manageUserFavourite(FavouriteRequest request, AppUser user) {

        Optional<Favourite> existingFavourite = favouritesRepository.findByUserAndAdvertisementId(user, request.advertisementId());

        if (existingFavourite.isEmpty()) {
            log.info("[FAVOURITE-SERVICE] -> ADD TO FAVOURITE ADVERTISEMENT WITH ID -> [{}] BY USER WITH ID -> [{}]", request.advertisementId(), user.getId());
            favouritesRepository.save(mapFavouriteRequestToEntity(request, user));
            return "Dodano do ulubionych";
        } else {
            log.info("[FAVOURITE-SERVICE] -> REMOVE FROM FAVOURITE ADVERTISEMENT WITH ID -> [{}] BY USER WITH ID -> [{}]", request.advertisementId(), user.getId());
            favouritesRepository.delete(existingFavourite.get());
            return "Usunieto z ulubionych";
        }
    }

    public boolean checkIsFavourite(String advertisementId, String loggedUser) {
        return favouritesRepository.checkIsFavourite(loggedUser, advertisementId);
    }

    public List<UUID> getUserFavouriteAdvertisementIds(String loggedUser) {
        return favouritesRepository.findAllFavouritesIdByUserName(loggedUser);
    }

    public List<AdvertisementDTO> getUserFavouriteAdvertisements(String loggedUser) {
        List<UUID> uuidList = favouritesRepository.findAllFavouritesIdByUserName(loggedUser);
        return advertisementRepository.findByListOfUUIDs(uuidList).stream()
                .map(advertisement -> mapToAdvertisementDTO(advertisement, false)).toList();
    }


}
