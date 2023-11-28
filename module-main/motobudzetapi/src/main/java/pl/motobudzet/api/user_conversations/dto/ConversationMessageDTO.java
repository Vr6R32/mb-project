package pl.motobudzet.api.user_conversations.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationMessageDTO {

    private Long id;
    private String userSender;
    private String message;
    private LocalDate messageSendDate;
    private LocalTime messageSendTime;
    private LocalDate messageReadDate;
    private LocalTime messageReadTime;
    private LocalDateTime messageSendDateTime;
    private LocalDateTime messageReadDateTime;

}
