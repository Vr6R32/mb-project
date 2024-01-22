package pl.motobudzet.api.vehicle_model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ModelRepository extends JpaRepository<Model, Long> {

    @Query("select a from Model a LEFT JOIN FETCH a.brand where a.name = ?1 and a.brand.name = ?2")
    Optional<Model> findByNameAndBrandName(String name, String brandName);

    @Query("select a from Model a where a.brand.name = ?1")
    List<Model> findAllModelsByBrandName(String brand);

}