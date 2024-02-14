package pl.motobudzet.api.persistance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.motobudzet.api.domain.favourites.Favourite;
import pl.motobudzet.api.domain.user.AppUser;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FavouritesRepository extends JpaRepository<Favourite, Long> {

    @Query("SELECT COUNT(a) > 0 FROM Favourite a WHERE a.userName = ?1 AND a.advertisementId = ?2")
    boolean checkIsFavourite(String userName, String advertisementId);

    @Query("SELECT a.advertisementId FROM Favourite a WHERE a.userName = ?1")
    List<UUID> findAllFavouritesIdByUserName(String userName);

    @Query("select a from Favourite a where a.appUser = ?1 and a.advertisementId = ?2")
    Optional<Favourite> findByUserAndAdvertisementId(AppUser user, String advertisementId);

}
