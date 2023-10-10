package pl.motobudzet.api.locationCity.repository;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
    @Query("SELECT c FROM City c LEFT JOIN FETCH c.cityState where c.name = ?1")
    Optional<City> getCityByName(String name);
}
