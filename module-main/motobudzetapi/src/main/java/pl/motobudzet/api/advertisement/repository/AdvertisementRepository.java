package pl.motobudzet.api.advertisement.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.motobudzet.api.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.advertisement.entity.Advertisement;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdvertisementRepository extends JpaRepository<Advertisement, UUID>, JpaSpecificationExecutor<Advertisement> {

    @Query("SELECT a FROM Advertisement a where a.isVerified = true")
    Page<Advertisement> findAllVerified(Pageable pageable);

    @Query("SELECT a FROM Advertisement a where a.isVerified = false")
//    @Query("SELECT a FROM Advertisement a LEFT JOIN FETCH a.user LEFT JOIN FETCH a.imageUrls where a.isVerified = false")
    Page<Advertisement> findAllToVerify(Pageable pageable);

    @Modifying
    @Query(value = "INSERT INTO advertisement_images (advertisement_id, image_urls) VALUES (?1, ?2)", nativeQuery = true)
    int insertNewPhoto(UUID id, String name);


    @Query("SELECT a FROM Advertisement a WHERE a.id IN ?1")
    List<Advertisement> getAllAdvertisementsByListOfIds(List<UUID> uuidList);

//    Page<Advertisement> findAll(Specification spec, Pageable pageable);

    @Query("SELECT a FROM Advertisement a " +
            "LEFT JOIN FETCH a.imageUrls " +
            "LEFT JOIN FETCH a.brand b " +
            "LEFT JOIN FETCH a.model m " +
            "LEFT JOIN FETCH a.driveType d " +
            "LEFT JOIN FETCH a.engineType e " +
            "LEFT JOIN FETCH a.fuelType f " +
            "LEFT JOIN FETCH a.user u " +
            "LEFT JOIN FETCH a.transmissionType t WHERE a.id = :uuid")
    Optional<Advertisement> findOneByIdWithFetch(UUID uuid);

    @Query("SELECT a FROM Advertisement a " +
            "LEFT JOIN FETCH a.imageUrls " +
            "LEFT JOIN FETCH a.brand b " +
            "LEFT JOIN FETCH a.model m " +
            "LEFT JOIN FETCH a.driveType d " +
            "LEFT JOIN FETCH a.engineType e " +
            "LEFT JOIN FETCH a.fuelType f " +
            "LEFT JOIN FETCH a.user u " +
            "LEFT JOIN FETCH a.transmissionType t WHERE a.user.id = ?1 ORDER BY a.creationTime DESC")
    List<Advertisement> findAllAdvertisementsByUserId(Long userNameId);

//    List<String> findAdvertisementGallery(UUID id);
//    @Query("SELECT a.imageUrls FROM Advertisement a where a.id = :id")
//    @Query("SELECT a FROM Advertisement a where a.brand = :brand and a.isVerified = true")
//    Page<Advertisement> findAllActivatedWithoutRelationsByBrand(Pageable pageable, Brand brand);
//
//    @Query("SELECT a FROM Advertisement a  where a.brand = :brand and a.model = :model and a.isVerified = true")
//    Page<Advertisement> findAllActivatedWithoutRelationsByBrandAndModel(Pageable pageable, Brand brand, Model model);



}