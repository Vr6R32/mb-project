package pl.motobudzet.api.mappers;

import pl.motobudzet.api.user_messaging.Message;
import pl.motobudzet.api.user_messaging.MessageDTO;
import pl.motobudzet.api.utils.MessageDateTimeExtractor;

import java.time.LocalDateTime;

public class MessageMapper {
    private MessageMapper() {
    }

    public static MessageDTO mapToConversationMessageDTO(Message message) {

        LocalDateTime messageSendDateTime = message.getMessageSendDateTime();

        String messageSendDate = MessageDateTimeExtractor.extractDate(messageSendDateTime);
        String messageSendTime = MessageDateTimeExtractor.extractTime(messageSendDateTime);


        MessageDTO build = MessageDTO.builder()
                .id(message.getId())
                .message(message.getMessage())
                .messageSendDate(messageSendDate)
                .messageSendTime(messageSendTime)
//                .messageReadDate(messageReadDate)
//                .messageReadTime(messageReadTime)
                .userSender(message.getMessageSender().getUsername())
                .build();

        LocalDateTime messageReadDateTime = message.getMessageReadDateTime();

        if (messageReadDateTime != null) {
            String messageReadDate = MessageDateTimeExtractor.extractDate(messageReadDateTime);
            String messageReadTime = MessageDateTimeExtractor.extractTime(messageReadDateTime);
            build.setMessageReadDate(messageReadDate);
            build.setMessageReadTime(messageReadTime);
        }

        return build;
    }
}
