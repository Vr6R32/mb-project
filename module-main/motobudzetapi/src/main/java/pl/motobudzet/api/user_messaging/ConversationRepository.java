package pl.motobudzet.api.user_messaging;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    Conversation findByAdvertisementIdAndUserOwnerId(UUID uuid, Long userOwnerId);

    Optional<Conversation> findConversationByAdvertisement_IdAndUserOwner_IdAndUserClient_Id(UUID advertisementId, Long userOwnerId, Long userClientId);

    @Query("select c from Conversation c left join fetch c.advertisement left join fetch c.userClient left join fetch c.userOwner where c.userOwner.id = ?1 ")
    List<Conversation> findAllByUserOwnerId(Long id);

    @Query("select c from Conversation c left join fetch c.advertisement left join fetch c.userClient left join fetch c.userOwner where c.userClient.id = ?1")
    List<Conversation> findAllByUserClientId(Long id);

    @Query("SELECT c FROM Conversation c " +
            "LEFT JOIN FETCH c.advertisement adv " +
            "LEFT JOIN FETCH adv.fuelType " +
            "LEFT JOIN FETCH adv.brand " +
            "LEFT JOIN FETCH adv.model " +
            "LEFT JOIN FETCH adv.engineType " +
            "LEFT JOIN FETCH adv.driveType " +
            "LEFT JOIN FETCH adv.transmissionType " +
            "LEFT JOIN FETCH adv.city " +
            "LEFT JOIN FETCH adv.city.cityState " +
            "LEFT JOIN FETCH c.userClient " +
            "LEFT JOIN FETCH c.userOwner " +
            "LEFT JOIN FETCH c.lastMessage " +
            "WHERE c.userOwner.id = ?1 OR c.userClient.id = ?1 " +
            "ORDER BY c.lastMessage.messageSendDateTime DESC ")
    List<Conversation> findAllConversationsByUserId(Long id);

    @Query("select c.id from Conversation c where c.advertisement.id = ?1 and c.userClient.userName = ?2")
    Optional<Long> findByUserClientIdAndAdvertisementId(UUID advertisementId, String name);
}
