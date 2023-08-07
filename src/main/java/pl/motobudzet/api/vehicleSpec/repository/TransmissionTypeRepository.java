package pl.motobudzet.api.vehicleSpec.repository;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.motobudzet.api.vehicleSpec.entity.TransmissionType;

import java.util.List;
import java.util.Optional;
@Repository
public interface TransmissionTypeRepository extends JpaRepository<TransmissionType,Long> {

    @Cacheable("transmission_type_cache_by_name")
    @Query("select t from TransmissionType t where t.name = ?1")
    Optional<TransmissionType> findByNejm(String transmissionTypeName);

    @Cacheable(value = "transmission_type_cache_by_id")
    @Query("select t from TransmissionType t where t.id = ?1")
    Optional<TransmissionType> findByAjdi(Long transmissionTypeId);

    @Cacheable(value = "transmission_type_cache_all")
    @Query("select t from TransmissionType t")
    List<TransmissionType> findAllCached();
}
