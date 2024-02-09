package pl.motobudzet.api.domain.favourites;

import lombok.RequiredArgsConstructor;
import pl.motobudzet.api.domain.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.persistance.AdvertisementRepository;
import pl.motobudzet.api.domain.user.entity.AppUser;
import pl.motobudzet.api.persistance.FavouritesRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static pl.motobudzet.api.infrastructure.mapper.AdvertisementMapper.mapToAdvertisementDTO;
import static pl.motobudzet.api.infrastructure.mapper.FavouriteMapper.mapFavouriteRequestToEntity;


@RequiredArgsConstructor
public class FavouritesServiceImpl implements FavouriteService {

    private final FavouritesRepository favouritesRepository;
    private final AdvertisementRepository advertisementRepository;

    public String manageUserFavourite(FavouriteRequest request, AppUser loggedUser) {

        Optional<Favourite> existingFavourite = favouritesRepository.findByUserAndAdvertisementId(loggedUser, request.advertisementId());

        if (existingFavourite.isEmpty()) {
            favouritesRepository.save(mapFavouriteRequestToEntity(request, loggedUser));
            return "Dodano do ulubionych";
        } else {
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
