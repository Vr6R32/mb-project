package pl.motobudzet.api.domain.messages;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.domain.advertisement.entity.Advertisement;
import pl.motobudzet.api.domain.advertisement.service.AdvertisementService;
import pl.motobudzet.api.domain.user.entity.AppUser;

import java.util.List;
import java.util.UUID;

import static pl.motobudzet.api.infrastructure.mapper.ConversationMapper.mapConversationToDTO;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final AdvertisementService advertisementService;
    private final ConversationRepository conversationRepository;

    public Conversation createConversation(UUID advertisementId, AppUser loggedUser) {

        Advertisement advertisement = advertisementService.getAdvertisement(advertisementId);

        Conversation conversation = Conversation.builder()
                .advertisement(advertisement)
                .userOwner(advertisement.getUser())
                .userClient(loggedUser)
                .build();

        conversationRepository.saveAndFlush(conversation);

        return conversation;
    }

    public List<ConversationDTO> getAllConversations(AppUser loggedUser) {
        List<Conversation> conversationList = conversationRepository.findAllConversationsByUserId(loggedUser.getId());
        return conversationList.stream().map(conversation -> mapConversationToDTO(conversation, loggedUser.getUsername())).toList();
    }

    public Long findConversationIdByAdvIdAndSender(UUID advertisementId, String name) {
        return conversationRepository.findByUserClientIdAndAdvertisementId(advertisementId, name).orElse(-1L);
    }

    public Conversation findConversationByAdvertisementIdAndUserSender(UUID advertisementId, AppUser messageSender) {
        return conversationRepository
                .findByAdvertisementIdAndUserClientId(messageSender,advertisementId).orElse(null);
    }
}
