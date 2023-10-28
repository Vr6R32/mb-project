package pl.motobudzet.api.advertisement.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.motobudzet.api.advertisement.entity.Advertisement;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdvertisementRepository extends JpaRepository<Advertisement, UUID>, JpaSpecificationExecutor<Advertisement> {


    @Query("SELECT a FROM Advertisement a " +
            "LEFT JOIN FETCH a.imageUrls " +
            "LEFT JOIN FETCH a.brand b " +
            "LEFT JOIN FETCH a.model m " +
            "LEFT JOIN FETCH a.driveType d " +
            "LEFT JOIN FETCH a.engineType e " +
            "LEFT JOIN FETCH a.fuelType f " +
            "LEFT JOIN FETCH a.user u " +
            "LEFT JOIN FETCH a.transmissionType t " +
            "LEFT JOIN FETCH a.city c " +
            "LEFT JOIN FETCH a.city.cityState cs " +
            "WHERE a.id IN :uuids")
    List<Advertisement> findByListOfUUIDs(@Param("uuids") List<UUID> uuids);

//    @Query("SELECT a FROM Advertisement a " +
//            "LEFT JOIN FETCH a.imageUrls " +
//            "LEFT JOIN FETCH a.brand b " +
//            "LEFT JOIN FETCH a.model m " +
//            "LEFT JOIN FETCH a.driveType d " +
//            "LEFT JOIN FETCH a.engineType e " +
//            "LEFT JOIN FETCH a.fuelType f " +
//            "LEFT JOIN FETCH a.user u " +
//            "LEFT JOIN FETCH a.transmissionType t " +
//            "left join fetch a.city ac " +
//            "left join fetch ac.cityState acs " +
//            "where a.isVerified = true")
//    List<Advertisement> findAllVerified();



//    @Query(value =
//            "SELECT a.*, b.name as brand_name, m.name as model_name, d.name as drive_type_name, e.name as engine_type_name, f.name as fuel_type_name, u.email as user_email, t.name as transmission_type_name, ac.name as city_name, acs.name as city_state_name " +
//                    "FROM Advertisement a " +
//                    "LEFT JOIN brand b ON a.brand_id = b.id " +
//                    "LEFT JOIN model m ON a.model_id = m.id " +
//                    "LEFT JOIN drive_type d ON a.drive_type_id = d.id " +
//                    "LEFT JOIN engine_type e ON a.engine_type_id = e.id " +
//                    "LEFT JOIN fuel_type f ON a.fuel_type_id = f.id " +
//                    "LEFT JOIN app_user u ON a.user_id = u.id " +
//                    "LEFT JOIN transmission_type t ON a.transmission_type_id = t.id " +
//                    "LEFT JOIN cities ac ON a.city_id = ac.id " +
//                    "LEFT JOIN city_states acs ON ac.state_id = acs.id " +
//                    "WHERE a.is_verified = true " +
//                    "LIMIT 12",
//            nativeQuery = true)
//    List<Advertisement> findAllVerified();

    @Query("SELECT a FROM Advertisement a " +
            "LEFT JOIN FETCH a.imageUrls " +
            "LEFT JOIN FETCH a.brand b " +
            "LEFT JOIN FETCH a.model m " +
            "LEFT JOIN FETCH a.driveType d " +
            "LEFT JOIN FETCH a.engineType e " +
            "LEFT JOIN FETCH a.fuelType f " +
            "LEFT JOIN FETCH a.user u " +
            "LEFT JOIN FETCH a.transmissionType t " +
            "LEFT JOIN FETCH a.city c " +
            "LEFT JOIN FETCH a.city.cityState cs " +
            " where a.isVerified = false or a.isActive = false")
//    @Query("SELECT a FROM Advertisement a LEFT JOIN FETCH a.user LEFT JOIN FETCH a.imageUrls where a.isVerified = false")
    Page<Advertisement> findAllToEnableAndVerify(Pageable pageable);

    @Modifying
    @Query(value = "INSERT INTO advertisement_images (advertisement_id, image_urls) VALUES (?1, ?2)", nativeQuery = true)
    int insertNewPhoto(UUID id, String name);


    @Query("SELECT a FROM Advertisement a " +
            "LEFT JOIN FETCH a.imageUrls " +
            "LEFT JOIN FETCH a.brand b " +
            "LEFT JOIN FETCH a.model m " +
            "LEFT JOIN FETCH a.driveType d " +
            "LEFT JOIN FETCH a.engineType e " +
            "LEFT JOIN FETCH a.fuelType f " +
            "LEFT JOIN FETCH a.transmissionType t " +
            "LEFT JOIN FETCH a.user u " +
            "LEFT JOIN FETCH a.city c " +
            "LEFT JOIN FETCH a.city.cityState cs " +
           " WHERE a.id IN ?1")
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
            "LEFT JOIN FETCH a.city c " +
            "LEFT JOIN FETCH a.city.cityState cs " +
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
            "LEFT JOIN FETCH a.city c " +
            "LEFT JOIN FETCH a.city.cityState cs " +
            "LEFT JOIN FETCH a.transmissionType t WHERE a.user.id = ?1 and a.isDeleted = false ORDER BY a.creationTime DESC")
    List<Advertisement> findAllAdvertisementsByUserId(Long userNameId);

    @Query("select a from Advertisement a " +
            "left join fetch a.city " +
            "left join fetch a.driveType " +
            "left join fetch a.fuelType " +
            "left join fetch a.engineType " +
            "left join fetch a.model " +
            "left join fetch a.brand " +
            "left join fetch a.user " +
            "left join fetch a.city c " +
            "left join fetch c.cityState cs " +
            "left join fetch a.transmissionType " +
            "where a.id = ?1")
    Optional<Advertisement> findByAjdi(UUID uuid);

    @Modifying
    @Query("UPDATE Advertisement a SET a.isDeleted = true WHERE a.id = ?1")
    int updateAdvertisementIsDeleted(UUID id);



//    List<String> findAdvertisementGallery(UUID id);
//    @Query("SELECT a.imageUrls FROM Advertisement a where a.id = :id")
//    @Query("SELECT a FROM Advertisement a where a.brand = :brand and a.isVerified = true")
//    Page<Advertisement> findAllActivatedWithoutRelationsByBrand(Pageable pageable, Brand brand);
//
//    @Query("SELECT a FROM Advertisement a  where a.brand = :brand and a.model = :model and a.isVerified = true")
//    Page<Advertisement> findAllActivatedWithoutRelationsByBrandAndModel(Pageable pageable, Brand brand, Model model);



}