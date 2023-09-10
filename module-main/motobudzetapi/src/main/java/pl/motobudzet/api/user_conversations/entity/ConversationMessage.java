package pl.motobudzet.api.user_conversations.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import pl.motobudzet.api.user.entity.AppUser;

import java.time.LocalDateTime;

@Entity
@Data
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "conversation_messages")
public class ConversationMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String message;
    @ManyToOne(fetch = FetchType.LAZY)
    private Conversation conversation;
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
    private AppUser messageSender;
    private LocalDateTime messageSendDateTime;
    private LocalDateTime messageReadDateTime;

}
