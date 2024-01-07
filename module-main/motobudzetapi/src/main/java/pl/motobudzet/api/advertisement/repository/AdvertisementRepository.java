package pl.motobudzet.api.advertisement.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.motobudzet.api.advertisement.entity.Advertisement;
import pl.motobudzet.api.thymeleaf.MetaDataDTO;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdvertisementRepository extends JpaRepository<Advertisement, UUID>, JpaSpecificationExecutor<Advertisement> {


    @Query("SELECT new pl.motobudzet.api.thymeleaf.MetaDataDTO(a.name, a.mainPhotoUrl,a.price,a.priceUnit,a.mileage,a.mileageUnit) FROM Advertisement a WHERE a.id = :id")
    Optional<MetaDataDTO> findMetaDataById(@Param("id") UUID id);

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
            "WHERE a.id IN ?1")
    List<Advertisement> findByListOfUUIDs(List<UUID> uuidList);

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

    @Query("SELECT a.id FROM Advertisement a " +
            "WHERE a.isVerified = false OR a.isActive = false ")
    List<UUID> getListOfUUIDsToEnable(Pageable pageable);

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
            "LEFT JOIN FETCH a.transmissionType t " +
            "WHERE a.user.id = ?1 and a.isDeleted = false ORDER BY a.createDate DESC")
    List<Advertisement> getAllUserAdvertisementsByUserId(Long userId);


    @Modifying
    @Query("UPDATE Advertisement a SET a.isDeleted = true WHERE a.id = ?1")
    int updateAdvertisementIsDeleted(UUID id);


}