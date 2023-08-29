package pl.motobudzet.api.vehicleSpec.repository;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.motobudzet.api.vehicleSpec.entity.FuelType;
import pl.motobudzet.api.vehicleSpec.entity.TransmissionType;

import java.util.List;
import java.util.Optional;
@Repository
public interface FuelTypeRepository extends JpaRepository<FuelType,Long> {

    @Cacheable("fuel_type_cache_by_name")
    @Query("select f from FuelType f where f.name = ?1")
    Optional<FuelType> findByNejm(String fuelTypeName);
    @Cacheable(value = "fuel_type_cache_by_id")
    @Query("select f from FuelType f where f.id = ?1")
    Optional<FuelType> findByAjdi(Long fuelTypeId);

    @Cacheable(value = "fuel_type_cache_all")
    @Query("select f from FuelType f")
    List<FuelType> findAllCached();
}
