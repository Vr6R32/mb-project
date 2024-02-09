package pl.motobudzet.api.infrastructure.mailing;

import lombok.*;


@Builder
public record EmailNotificationRequest(
        String message,
        String senderName,
        String receiverEmail,
        String advertisementTitle
) {

}
