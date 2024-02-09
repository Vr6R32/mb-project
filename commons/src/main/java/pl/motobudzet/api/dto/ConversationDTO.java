package pl.motobudzet.api.dto;


import lombok.Builder;


@Builder
public record ConversationDTO(Long conversationId,String secondUser,AdvertisementDTO advertisement,MessageDTO lastMessage) {

}
