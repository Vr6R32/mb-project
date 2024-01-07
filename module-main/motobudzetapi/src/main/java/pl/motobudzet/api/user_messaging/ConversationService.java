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

    public Long createConversation(UUID advertisementId, String loggedUser) {

        AppUser userClient = userCustomService.getUserByName(loggedUser);
        Advertisement advertisement = advertisementService.getAdvertisement(advertisementId);

        if (advertisement.getUser().getUsername().equals(loggedUser)) {
            return null;
        } else {
            Conversation conversation = Conversation.builder()
                    .advertisement(advertisement)
                    .userOwner(advertisement.getUser())
                    .userClient(userClient)
                    .build();
            return conversationRepository.saveAndFlush(conversation).getId();
        }
    }


    public Conversation findConversationById(Long conversationId) {
        return conversationRepository
                .findById(conversationId).orElse(null);
    }

    public List<ConversationDTO> getAllConversations(String loggedUser) {
        AppUser user = userCustomService.getUserByName(loggedUser);
        List<Conversation> conversationList = conversationRepository.findAllConversationsByUserId(user.getId());
        return conversationList.stream().map(conversation -> mapConversationToDTO(conversation, loggedUser)).toList();
    }

    public Long findConversationIdByAdvIdAndSender(UUID advertisementId, String name) {
        return conversationRepository.findByUserClientIdAndAdvertisementId(advertisementId, name).orElse(-1L);
    }
}