package pl.motobudzet.api.domain.messages;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import pl.motobudzet.api.domain.advertisement.entity.Advertisement;
import pl.motobudzet.api.domain.user.entity.AppUser;

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
    private List<Message> messages;
    @OneToOne(fetch = FetchType.LAZY)
    private Message lastMessage;

}
