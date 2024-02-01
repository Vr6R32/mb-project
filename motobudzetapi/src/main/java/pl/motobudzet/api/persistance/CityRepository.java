package pl.motobudzet.api.persistance;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pl.motobudzet.api.domain.location.City;

import java.util.List;
import java.util.Optional;

public interface CityRepository extends JpaRepository<City, Long> {

    @Query("SELECT c from City c LEFT JOIN FETCH c.cityState")
    @Cacheable(value = "cities_with_states")
    List<City> getAllCitiesWithCityStates();

    @Query("SELECT c FROM City c LEFT JOIN FETCH c.cityState where c.name = ?1")
    Optional<City> getCityByNameWithState(String name);

    @Query("SELECT c FROM City c LEFT JOIN FETCH c.cityState where c.name = ?1 and c.cityState.name = ?2")
    Optional<City> getCityByNameAndState(String cityName, String cityStateName);

    @Cacheable(value = "cities_without_states")
    @Query("SELECT c FROM City c where c.name = ?1")
    Optional<City> getCityByNameWithoutState(String name);

    @Query("SELECT c FROM City c LEFT JOIN FETCH c.cityState cs WHERE LOWER(c.name) LIKE LOWER(concat('%', :partialName, '%')) order by c.name asc ")
    List<City> findByPartialName(String partialName);

}
