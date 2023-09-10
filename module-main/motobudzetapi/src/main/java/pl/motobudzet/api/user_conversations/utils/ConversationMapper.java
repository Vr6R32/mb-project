package pl.motobudzet.api.user_conversations.utils;

import pl.motobudzet.api.advertisement.service.PublicAdvertisementService;
import pl.motobudzet.api.user_conversations.dto.ConversationDTO;
import pl.motobudzet.api.user_conversations.entity.Conversation;
import pl.motobudzet.api.user_conversations.entity.ConversationMessage;

public class ConversationMapper {
    private ConversationMapper() {
    }

    public static ConversationDTO mapConversationToDTO(Conversation conversation, String ownerName, PublicAdvertisementService advertisementService) {

        String secondUserName = null;

        if (ownerName.equals(conversation.getAdvertisement().getUser().getUsername())) {
            secondUserName = conversation.getUserClient().getUsername();
        } else {
            secondUserName = conversation.getUserOwner().getUsername();
        }

        ConversationMessage conversationLastMessage = conversation.getLastMessage();

        ConversationDTO.ConversationDTOBuilder builder = ConversationDTO.builder()
                .conversationId(conversation.getId())
                .advertisement(advertisementService.mapToAdvertisementDTO(conversation.getAdvertisement(), false))
                .secondUser(secondUserName);

        if (conversationLastMessage != null) {
            builder.lastMessage(MessageMapper.mapToConversationMessageDTO(conversationLastMessage));
        }

        return builder.build();
    }
}

