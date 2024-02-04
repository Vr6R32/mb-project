package pl.motobudzet.api.persistance;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.motobudzet.api.domain.location.CityState;

import java.util.List;

@Repository
public interface CityStateRepository extends JpaRepository<CityState, Long> {

    @Cacheable(value = "cities_states")
    @Query("select c from CityState c")
    List<CityState> findAllCitiesStates();

}
