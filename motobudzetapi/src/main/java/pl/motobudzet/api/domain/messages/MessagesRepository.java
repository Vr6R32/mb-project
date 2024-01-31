package pl.motobudzet.api.domain.messages;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessagesRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m" +
            " LEFT JOIN FETCH m.messageSender" +
            " LEFT JOIN FETCH m.conversation c" +
            " LEFT JOIN FETCH c.userOwner" +
            " WHERE m.conversation.id = ?1")
    List<Message> getAllMessages(Long conversationId);

}
