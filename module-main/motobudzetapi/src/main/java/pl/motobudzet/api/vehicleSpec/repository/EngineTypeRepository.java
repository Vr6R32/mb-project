package pl.motobudzet.api.vehicleSpec.repository;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.motobudzet.api.vehicleSpec.entity.EngineType;

import java.util.List;
import java.util.Optional;

@Repository
public interface EngineTypeRepository extends JpaRepository<EngineType, Long> {

    @Cacheable("engine_type_cache_by_name")
    @Query("select e from EngineType e where e.name = ?1")
    Optional<EngineType> findByNejm(String engineTypeName);

    @Cacheable(value = "engine_type_cache_by_id")
    @Query("select e from EngineType e where e.id = ?1")
    Optional<EngineType> findByAjdi(Long engineTypeId);

    @Cacheable(value = "engine_type_cache_all")
    @Query("select e from EngineType e")
    List<EngineType> findAllCached();
}
