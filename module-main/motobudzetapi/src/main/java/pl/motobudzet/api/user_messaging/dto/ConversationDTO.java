package pl.motobudzet.api.user_messaging.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import pl.motobudzet.api.advertisement.dto.AdvertisementDTO;


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
