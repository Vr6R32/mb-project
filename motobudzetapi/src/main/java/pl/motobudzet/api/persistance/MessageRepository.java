package pl.motobudzet.api.persistance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.motobudzet.api.domain.messaging.Message;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m" +
            " LEFT JOIN FETCH m.messageSender" +
            " LEFT JOIN FETCH m.conversation c" +
            " LEFT JOIN FETCH c.userOwner" +
            " WHERE m.conversation.id = ?1")
    List<Message> getAllMessages(Long conversationId);

}
