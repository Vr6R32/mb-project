package pl.motobudzet.api.mappers;

import pl.motobudzet.api.user_messaging.Conversation;
import pl.motobudzet.api.user_messaging.ConversationDTO;
import pl.motobudzet.api.user_messaging.Message;

import static pl.motobudzet.api.mappers.AdvertisementMapper.mapToAdvertisementDTO;

public class ConversationMapper {

    public static ConversationDTO mapConversationToDTO(Conversation conversation, String ownerName) {

        String secondUserName;

        if (ownerName.equals(conversation.getAdvertisement().getUser().getUsername())) {
            secondUserName = conversation.getUserClient().getUsername();
        } else {
            secondUserName = conversation.getUserOwner().getUsername();
        }

        Message conversationLastMessage = conversation.getLastMessage();

        ConversationDTO.ConversationDTOBuilder builder = ConversationDTO.builder()
                .conversationId(conversation.getId())
                .advertisement(mapToAdvertisementDTO(conversation.getAdvertisement(), false))
                .secondUser(secondUserName);

        if (conversationLastMessage != null) {
            builder.lastMessage(MessageMapper.mapToConversationMessageDTO(conversationLastMessage));
        }

        return builder.build();
    }
}

