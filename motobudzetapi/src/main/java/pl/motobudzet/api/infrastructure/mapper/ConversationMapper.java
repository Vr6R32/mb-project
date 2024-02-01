package pl.motobudzet.api.infrastructure.mapper;

import pl.motobudzet.api.domain.messaging.Conversation;
import pl.motobudzet.api.domain.messaging.ConversationDTO;
import pl.motobudzet.api.domain.messaging.Message;

import static pl.motobudzet.api.infrastructure.mapper.AdvertisementMapper.mapToAdvertisementDTO;

public class ConversationMapper {

    private ConversationMapper() {
    }

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
            builder.lastMessage(MessageMapper.mapToMessageDTO(conversationLastMessage));
        }

        return builder.build();
    }
}

