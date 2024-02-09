package pl.motobudzet.api.model;

import lombok.*;

import java.util.List;
import java.util.UUID;


@Builder
public record EmailNotificationRequest(
        String message,
        String senderName,

        UUID advertisementId,
        String advertisementTitle,
        String advertisementModel,
        String advertisementBrand,

        String userName,
        String userRegisterCode,
        String userResetPasswordCode,
        List<String> receiverEmail


) {

}
