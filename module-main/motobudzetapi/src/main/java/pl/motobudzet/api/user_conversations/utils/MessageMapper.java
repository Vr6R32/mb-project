package pl.motobudzet.api.user_conversations.utils;

import pl.motobudzet.api.user_conversations.dto.ConversationMessageDTO;
import pl.motobudzet.api.user_conversations.entity.ConversationMessage;

import java.time.LocalDateTime;

public class MessageMapper {
    private MessageMapper() {
    }

    public static ConversationMessageDTO mapToConversationMessageDTO(ConversationMessage conversationMessage) {

        LocalDateTime messageSendDateTime = conversationMessage.getMessageSendDateTime();

        String messageSendDate = MessageDateTimeExtractor.extractDate(messageSendDateTime);
        String messageSendTime = MessageDateTimeExtractor.extractTime(messageSendDateTime);


        ConversationMessageDTO build = ConversationMessageDTO.builder()
                .id(conversationMessage.getId())
                .message(conversationMessage.getMessage())
                .messageSendDate(messageSendDate)
                .messageSendTime(messageSendTime)
//                .messageReadDate(messageReadDate)
//                .messageReadTime(messageReadTime)
                .userSender(conversationMessage.getMessageSender().getUsername())
                .build();

        LocalDateTime messageReadDateTime = conversationMessage.getMessageReadDateTime();

        if (messageReadDateTime != null) {
            String messageReadDate = MessageDateTimeExtractor.extractDate(messageReadDateTime);
            String messageReadTime = MessageDateTimeExtractor.extractTime(messageReadDateTime);
            build.setMessageReadDate(messageReadDate);
            build.setMessageReadTime(messageReadTime);
        }

        return build;
    }
}
