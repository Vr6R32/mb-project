package pl.motobudzet.api.infrastructure.mailing;

import lombok.AllArgsConstructor;
import pl.motobudzet.api.domain.advertisement.entity.Advertisement;
import pl.motobudzet.api.domain.user.entity.AppUser;

import java.util.UUID;

@AllArgsConstructor
public class EmailManagerFacade {

    private final SpringMailSenderService mailSenderService;

    public void sendMessageNotificationHtml(EmailMessageRequest request) {
        mailSenderService.sendMessageNotificationHtml(request);
    }

    public void sendRegisterActivationNotificationHtml(AppUser user) {
        mailSenderService.sendRegisterActivationNotificationHtml(user);
    }

    public void sendResetPasswordNotificationCodeLink(AppUser user) {
        mailSenderService.sendResetPasswordNotificationCodeLink(user);
    }

    public void sendAdvertisementActivationConfirmNotification(AppUser user, Advertisement advertisement) {
        mailSenderService.sendAdvertisementActivationConfirmNotification(user,advertisement);
    }

    public void sendEmailNotificationToManagement(UUID id) {
        mailSenderService.sendEmailNotificationToManagement(id);
    }


}
