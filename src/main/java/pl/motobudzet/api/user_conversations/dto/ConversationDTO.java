package pl.motobudzet.api.user_conversations.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import pl.motobudzet.api.advertisement.dto.AdvertisementDTO;
import pl.motobudzet.api.user_conversations.entity.ConversationMessage;

import java.util.List;


@Data
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationDTO {

    private Long conversationId;
    private String secondUser;
    private AdvertisementDTO advertisement;
    private ConversationMessageDTO lastMessage;

}
