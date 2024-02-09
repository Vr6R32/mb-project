package pl.motobudzet.api.persistance;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.motobudzet.api.domain.advertisement.entity.Advertisement;
import pl.motobudzet.api.model.Status;
import pl.motobudzet.api.infrastructure.thymeleaf.MetaDataDTO;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdvertisementRepository extends JpaRepository<Advertisement, UUID>, JpaSpecificationExecutor<Advertisement> {


    @Query("SELECT new pl.motobudzet.api.infrastructure.thymeleaf.MetaDataDTO(a.name, a.mainPhotoUrl,a.price,a.priceUnit,a.mileage,a.mileageUnit) FROM Advertisement a WHERE a.id = :id")
    Optional<MetaDataDTO> findMetaDataById(@Param("id") UUID id);

    @Query("SELECT a FROM Advertisement a " +
            "LEFT JOIN FETCH a.imageUrls " +
            "LEFT JOIN FETCH a.brand b " +
            "LEFT JOIN FETCH a.model m " +
            "LEFT JOIN FETCH a.user u " +
            "LEFT JOIN FETCH a.city c " +
            "LEFT JOIN FETCH a.city.cityState cs " +
            "WHERE a.id IN ?1")
    //            "WHERE a.id IN ?1 ORDER BY FIELD(a.id,?1)")
    List<Advertisement> findByListOfUUIDs(List<UUID> uuidList);

    @Query("SELECT a FROM Advertisement a " +
            "LEFT JOIN FETCH a.imageUrls " +
            "LEFT JOIN FETCH a.brand b " +
            "LEFT JOIN FETCH a.model m " +
            "LEFT JOIN FETCH a.user u " +
            "LEFT JOIN FETCH a.city c " +
            "LEFT JOIN FETCH a.city.cityState cs " +
            "WHERE a.id = :uuid")
    Optional<Advertisement> findOneByIdWithFetch(UUID uuid);

    @Query("SELECT a.id FROM Advertisement a " +
            "WHERE a.status IN ?1")
    List<UUID> getListOfUUIDsToEnable(Status pendingVerification, Pageable pageable);

    @Query("SELECT a FROM Advertisement a " +
            "LEFT JOIN FETCH a.imageUrls " +
            "LEFT JOIN FETCH a.brand b " +
            "LEFT JOIN FETCH a.model m " +
            "LEFT JOIN FETCH a.user u " +
            "LEFT JOIN FETCH a.city c " +
            "LEFT JOIN FETCH a.city.cityState cs " +
            "WHERE a.user.id = :userId AND a.status != 'DELETED' ORDER BY a.createDate DESC")
    List<Advertisement> getAllUserAdvertisementsByUserId(Long userId);


    @Modifying
    @Query("UPDATE Advertisement a SET a.status = 'DELETED' WHERE a.id = ?1")
    int updateAdvertisementIsDeleted(UUID id);


    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN true ELSE false END FROM Advertisement a " +
            "WHERE a.id = ?1 AND a.user.userName = ?2")
    boolean checkAdvertisementOwnerByUserName(UUID id, String username);

    @Modifying
    @Query("UPDATE Advertisement a SET a.status = 'REJECTED' WHERE a.id = ?1")
    int updateAdvertisementIsRejected(UUID id);
}