package pl.motobudzet.api.utils.mappers;

import pl.motobudzet.api.user_conversations.dto.ConversationMessageDTO;
import pl.motobudzet.api.user_conversations.entity.ConversationMessage;
import pl.motobudzet.api.utils.MessageDateTimeExtractor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import static pl.motobudzet.api.utils.MessageDateTimeExtractor.extractDate;
import static pl.motobudzet.api.utils.MessageDateTimeExtractor.extractTime;

public class MessageMapper {
    private MessageMapper() {
    }

    public static ConversationMessageDTO mapToConversationMessageDTO(ConversationMessage conversationMessage) {

        LocalDateTime messageSendDateTime = conversationMessage.getMessageSendDateTime();
        LocalDateTime messageReadDateTime = conversationMessage.getMessageReadDateTime();

        ConversationMessageDTO build = ConversationMessageDTO.builder()
                .id(conversationMessage.getId())
                .message(conversationMessage.getMessage())
                .messageSendDate(extractDate(messageSendDateTime))
                .messageSendTime(extractTime(messageSendDateTime))
                .userSender(conversationMessage.getMessageSender().getUsername())
                .build();

        if (messageReadDateTime != null) {
            build.setMessageReadDate(extractDate(messageReadDateTime));
            build.setMessageReadTime(extractTime(messageReadDateTime));
        }

        return build;
    }
}
