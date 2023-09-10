package pl.motobudzet.api.user_conversations.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.motobudzet.api.user_conversations.entity.Conversation;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation,Long> {
    Conversation findByAdvertisementIdAndUserOwnerId(UUID uuid,Long userOwnerId);

    Optional<Conversation> findConversationByAdvertisement_IdAndUserOwner_IdAndUserClient_Id(UUID advertisementId,Long userOwnerId,Long userClientId);

    @Query("select c from Conversation c left joinó fetch c.advertisement left join fetch c.userClient left join fetch c.userOwner where c.userOwner.id = ?1 ")
    List<Conversation> findAllByUserOwnerId(Long id);
    @Query("select c from Conversation c left join fetch c.advertisement left join fetch c.userClient left join fetch c.userOwner where c.userClient.id = ?1")
    List<Conversation> findAllByUserClientId(Long id);

    @Query("SELECT c FROM Conversation c " +
            "LEFT JOIN FETCH c.advertisement " +
            "LEFT JOIN FETCH c.userClient " +
            "LEFT JOIN FETCH c.userOwner " +
            "LEFT JOIN FETCH c.lastMessage " +
            "WHERE c.userOwner.id = ?1 OR c.userClient.id = ?1 " +
            "ORDER BY c.lastMessage.messageSendDateTime DESC ")
    List<Conversation> findAllConversationsByUserId(Long id);
}
