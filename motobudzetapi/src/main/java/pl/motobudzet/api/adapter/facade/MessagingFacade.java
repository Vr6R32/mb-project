package pl.motobudzet.api.adapter.facade;

import lombok.AllArgsConstructor;
import pl.motobudzet.api.dto.ConversationDTO;
import pl.motobudzet.api.dto.MessageDTO;
import pl.motobudzet.api.domain.messaging.MessagingService;
import pl.motobudzet.api.domain.user.entity.AppUser;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
public class MessagingFacade {

    private final MessagingService messagingService;

    public List<ConversationDTO> getConversations(AppUser loggedUser) {
        return messagingService.getAllUserConversations(loggedUser);
    }
    public Long getConversationIdByAdvIdAndSender(UUID advertisementId, String name) {
        return messagingService.findConversationIdByAdvIdAndSender(advertisementId, name);
    }
    public String sendMessage(String message, UUID advertisementId, AppUser user) {
        return messagingService.sendMessage(message, advertisementId, user);
    }
    public List<MessageDTO> getConversationMessages(Long conversationId, String loggedUser) {
        return messagingService.getAllMessages(conversationId,loggedUser);
    }
}
