package pl.motobudzet.api.vehicleBrand.repository;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.motobudzet.api.vehicleBrand.entity.Brand;
import pl.motobudzet.api.vehicleModel.entity.Model;

import java.util.List;
import java.util.Optional;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {

    @Cacheable(value = "vehicle_brand_cache_search_form")
    @Query(value = "select b from Brand b left join fetch b.modelList ORDER BY b.name asc")
    List<Brand> findAllBrandWithModel();

    @Cacheable(value = "vehicle_brand_cache_search_form_model")
    @Query("SELECT b.modelList FROM Brand b WHERE b.name = ?1")
    List<Model> findModelsByBrandName(String name);

    @Cacheable(value = "vehicle_brand_cache_by_id")
    @Query("select b from Brand b where b.id = ?1")
    Optional<Brand> findByAjdi(Long brandId);

    @Cacheable(value = "vehicle_brand_cache_by_name")
    Optional<Brand> findByName(String name);

    void deleteByName(String name);

}