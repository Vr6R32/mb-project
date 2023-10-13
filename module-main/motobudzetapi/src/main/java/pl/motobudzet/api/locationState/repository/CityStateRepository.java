package pl.motobudzet.api.locationState.repository;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.motobudzet.api.locationCity.entity.City;
import pl.motobudzet.api.locationState.entity.CityState;

import java.util.List;
import java.util.Optional;

@Repository
public interface CityStateRepository extends JpaRepository<CityState,Long> {

    @Cacheable(value = "cities_states")
    Optional<CityState> findByName(String name);

    @Cacheable(value = "cities_states")
    @Query("select c from CityState c")
    List<CityState> findAllCitiesStates();

    @Query("select c from City c")
    @Cacheable(value = "cities_states")
    Optional<CityState> findByAjdi(Long id);
}
