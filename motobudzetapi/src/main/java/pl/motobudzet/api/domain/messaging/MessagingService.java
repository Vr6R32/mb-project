package pl.motobudzet.api.domain.messaging;

import pl.motobudzet.api.domain.user.entity.AppUser;

import java.util.List;
import java.util.UUID;

public interface MessagingService {
    Conversation createConversation(UUID advertisementId, AppUser loggedUser);
    List<ConversationDTO> getAllUserConversations(AppUser loggedUser);
    Long findConversationIdByAdvIdAndSender(UUID advertisementId, String name);
    Conversation findConversationByAdvertisementIdAndUserSender(UUID advertisementId, AppUser messageSender);
    String sendMessage(String message, UUID advertisementId, AppUser user);
    List<MessageDTO> getAllMessages(Long conversationId, String loggedUser);
}