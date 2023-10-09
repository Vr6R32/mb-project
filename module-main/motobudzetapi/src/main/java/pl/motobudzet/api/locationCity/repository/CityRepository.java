package pl.motobudzet.api.locationCity.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pl.motobudzet.api.locationCity.entity.City;

import java.util.List;

public interface CityRepository extends JpaRepository<City,Long> {
    @Query("SELECT c from City c LEFT JOIN FETCH c.cityState")
    List<City> getAllCitiesWithCityStates();
}
