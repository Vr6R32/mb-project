package pl.motobudzet.api.domain.messaging;


import lombok.Builder;
import pl.motobudzet.api.domain.advertisement.dto.AdvertisementDTO;


@Builder
public record ConversationDTO(Long conversationId,String secondUser,AdvertisementDTO advertisement,MessageDTO lastMessage) {

}
