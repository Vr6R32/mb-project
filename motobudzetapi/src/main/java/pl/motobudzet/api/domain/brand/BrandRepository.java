package pl.motobudzet.api.domain.brand;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {

    @Cacheable(value = "vehicle_all_brands_cache")
    @Query(value = "select b from Brand b ORDER BY b.name asc")
    List<Brand> findAllBrands();

    @Cacheable(value = "vehicle_brand_cache_by_name")
    Optional<Brand> findByName(String name);

}