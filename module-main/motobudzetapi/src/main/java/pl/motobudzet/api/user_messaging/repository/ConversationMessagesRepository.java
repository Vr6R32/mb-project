package pl.motobudzet.api.user_messaging.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.motobudzet.api.user_messaging.entity.ConversationMessage;

import java.util.List;

@Repository
public interface ConversationMessagesRepository extends JpaRepository<ConversationMessage, Long> {

    @Query("SELECT m FROM ConversationMessage m" +
            " LEFT JOIN FETCH m.messageSender" +
            " LEFT JOIN FETCH m.conversation c" +
            " LEFT JOIN FETCH c.userOwner" +
            " WHERE m.conversation.id = ?1")
    List<ConversationMessage> getAllMessages(Long conversationId);

}
