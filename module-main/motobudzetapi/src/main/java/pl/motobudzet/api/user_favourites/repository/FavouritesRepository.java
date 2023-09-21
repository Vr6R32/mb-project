package pl.motobudzet.api.user_favourites.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.motobudzet.api.user.entity.AppUser;
import pl.motobudzet.api.user_favourites.entity.Favourite;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavouritesRepository extends JpaRepository<Favourite,Long> {

    @Query("SELECT COUNT(a) > 0 FROM Favourite a WHERE a.userName = ?1 AND a.advertisementId = ?2")
    boolean checkIsFavourite(String userName, String advertisementId);

    @Query("SELECT COUNT(a)  FROM Favourite a WHERE a.userName = ?1")
    int findAllFavouritesByUserName(String userName);

    @Query("SELECT a.advertisementId FROM Favourite a WHERE a.userName = ?1")
    List<String> findAllFavouritesIdByUserName(String userName);

    @Query("select a from Favourite a where a.appUser = ?1 and a.advertisementId = ?2")
    Optional<Favourite> findByUserAndAdvertisementId(AppUser user, String advertisementId);

}