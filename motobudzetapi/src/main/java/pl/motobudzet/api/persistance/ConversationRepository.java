package pl.motobudzet.api.persistance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.motobudzet.api.domain.messaging.Conversation;
import pl.motobudzet.api.domain.user.entity.AppUser;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("SELECT c FROM Conversation c " +
            "LEFT JOIN FETCH c.advertisement adv " +
            "LEFT JOIN FETCH adv.brand " +
            "LEFT JOIN FETCH adv.model " +
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

    @Query("SELECT c FROM Conversation c WHERE (c.userClient = ?1 OR c.userOwner = ?1) AND c.advertisement.id = ?2")
    Optional<Conversation> findByAdvertisementIdAndUserClientId(AppUser userSender, UUID advertisementId);
}
