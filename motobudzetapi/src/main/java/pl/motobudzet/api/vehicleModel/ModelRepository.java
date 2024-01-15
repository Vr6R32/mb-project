package pl.motobudzet.api.vehicleModel;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ModelRepository extends JpaRepository<Model, Long> {

    @Cacheable(value = "vehicle_model_cache_by_name")
    Optional<Model> findByName(String name);

    @Query("select a from Model a LEFT JOIN FETCH a.brand where a.name = ?1 and a.brand.name = ?2")
    Optional<Model> findByNameAndBrandName(String name, String brandName);

    @Cacheable(value = "vehicle_model_cache")
    @Query("select m from Model m where m.id = ?1 ORDER BY m.name asc")
    Optional<Model> findByAjdi(Long modelId);
}