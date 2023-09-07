package pl.motobudzet.api.user_conversations.dto;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import pl.motobudzet.api.advertisement.entity.Advertisement;
import pl.motobudzet.api.user.entity.AppUser;
import pl.motobudzet.api.user_conversations.entity.ConversationMessage;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationMessageDTO {

    private Long id;
    private String userSender;
    private String message;
    private String messageSendDate;
    private String messageSendTime;
    private String messageReadDate;
    private String messageReadTime;
    private LocalDateTime messageSendDateTime;
    private LocalDateTime messageReadDateTime;

}
