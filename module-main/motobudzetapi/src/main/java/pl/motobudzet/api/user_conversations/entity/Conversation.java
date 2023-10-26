package pl.motobudzet.api.user_conversations.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import pl.motobudzet.api.advertisement.entity.Advertisement;
import pl.motobudzet.api.user.entity.AppUser;

import java.util.List;

@Entity
@Data
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "conversations")
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(cascade = CascadeType.REMOVE)
    private Advertisement advertisement;
    @ManyToOne
    private AppUser userOwner;
    @ManyToOne
    private AppUser userClient;
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "conversation")
//    @JoinTable(
//            name = "conversation_to_messages_mapping",
//            joinColumns = @JoinColumn(name = "conversation_id"),
//            inverseJoinColumns = @JoinColumn(name = "conversation_message_id")
//    )
    private List<ConversationMessage> conversationMessages;
    @OneToOne(fetch = FetchType.LAZY)
    private ConversationMessage lastMessage;

}
