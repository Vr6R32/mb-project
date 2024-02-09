package pl.motobudzet.api.infrastructure.mapper;

import pl.motobudzet.api.domain.messaging.Message;
import pl.motobudzet.api.dto.MessageDTO;

import java.time.LocalDateTime;

import static pl.motobudzet.api.utils.LocalDateTimeFormatter.formatDate;
import static pl.motobudzet.api.utils.LocalDateTimeFormatter.formatTime;

public class MessageMapper {
    private MessageMapper() {
    }

    public static MessageDTO mapToMessageDTO(Message message) {

        LocalDateTime messageSendDateTime = message.getMessageSendDateTime();

        MessageDTO build = MessageDTO.builder()
                .id(message.getId())
                .message(message.getMessage())
                .messageSendDate(formatDate(messageSendDateTime))
                .messageSendTime(formatTime(messageSendDateTime))
                .userSender(message.getMessageSender().getUsername())
                .build();

        LocalDateTime messageReadDateTime = message.getMessageReadDateTime();
        if (messageReadDateTime != null) {
            String messageReadDate = formatDate(messageReadDateTime);
            String messageReadTime = formatTime(messageReadDateTime);
            build.setMessageReadDate(messageReadDate);
            build.setMessageReadTime(messageReadTime);
        }
        return build;
    }
}
