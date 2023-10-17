package pl.motobudzet.api.locationCity.repository;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.motobudzet.api.locationCity.dto.CityDTO;
import pl.motobudzet.api.locationCity.entity.City;

import java.util.List;
import java.util.Optional;

public interface CityRepository extends JpaRepository<City,Long> {
    @Query("SELECT c from City c LEFT JOIN FETCH c.cityState")
    @Cacheable(value = "cities_with_states")
    List<City> getAllCitiesWithCityStates();

    @Query("SELECT c from City c")
    @Cacheable(value = "cities_without_states")
    List<City> getAllCitiesWithOutCityStates();

    @Cacheable(value = "city_with_states")
    @Query("SELECT c FROM City c LEFT JOIN FETCH c.cityState where c.name = ?1")
    Optional<City> getCityByName(String name);
    @Cacheable(value = "cities_without_states")
    @Query("SELECT c FROM City c where c.name = ?1")
    Optional<City> getCityByNameWithout(String name);

    @Query("select c from City c LEFT JOIN FETCH c.cityState where c.id = ?1")
    @Cacheable(value = "cities_without_states")
    Optional<City> getCityById(Long cityId);

    @Query("SELECT c FROM City c LEFT JOIN FETCH c.cityState cs WHERE LOWER(c.name) LIKE LOWER(concat('%', :partialName, '%')) order by c.name asc ")
    List<City> findByPartialName(String partialName);

//    @Query("SELECT c FROM City c WHERE LOWER(unaccent(c.name)) LIKE LOWER(unaccent(concat('%', :partialName, '%'))) order by c.name asc")
//    List<City> findByPartialName(@Param("partialName") String partialName);

}
