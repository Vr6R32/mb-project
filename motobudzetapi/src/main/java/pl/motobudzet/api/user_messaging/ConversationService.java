package pl.motobudzet.api.user_messaging;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.advertisement.entity.Advertisement;
import pl.motobudzet.api.advertisement.service.AdvertisementService;
import pl.motobudzet.api.user_account.entity.AppUser;
import pl.motobudzet.api.user_account.service.AppUserCustomService;

import java.util.List;
import java.util.UUID;

import static pl.motobudzet.api.mappers.ConversationMapper.mapConversationToDTO;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final AdvertisementService advertisementService;
    private final AppUserCustomService userCustomService;
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

    public List<ConversationDTO> getAllConversations(String loggedUser) {
        AppUser user = userCustomService.getUserByName(loggedUser);
        List<Conversation> conversationList = conversationRepository.findAllConversationsByUserId(user.getId());
        return conversationList.stream().map(conversation -> mapConversationToDTO(conversation, loggedUser)).toList();
    }

    public Long findConversationIdByAdvIdAndSender(UUID advertisementId, String name) {
        return conversationRepository.findByUserClientIdAndAdvertisementId(advertisementId, name).orElse(-1L);
    }

    public Conversation findConversationByAdvertisementIdAndUserSender(UUID advertisementId, AppUser messageSender) {
        return conversationRepository
                .findByAdvertisementIdAndUserClientId(messageSender,advertisementId).orElse(null);
    }
}
