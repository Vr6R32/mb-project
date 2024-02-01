package pl.motobudzet.api.domain.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;


@Data
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
public class MessageDTO {

    private Long id;
    private String userSender;
    private String message;
    private String messageSendDate;
    private String messageSendTime;
    private String messageReadDate;
    private String messageReadTime;

}
