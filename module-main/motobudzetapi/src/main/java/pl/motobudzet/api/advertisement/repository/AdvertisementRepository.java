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
            "LEFT JOIN FETCH a.transmissionType t WHERE a.user.userName= ?1 and a.isDeleted = false ORDER BY a.createDate DESC")
    List<Advertisement> findAllAdvertisementsByUserId(String userName);

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
    int deleteAdvertisement(UUID id);



}