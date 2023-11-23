package pl.motobudzet.api.emailSender.dto;

import lombok.*;

@Builder
@Data
@Getter
@Setter
@ToString
@EqualsAndHashCode
@RequiredArgsConstructor
@AllArgsConstructor
public class EmailMessageRequest {

    String message;
    String senderName;
    String receiverEmail;
    String advertisementTitle;
    String advertisementId;

}
