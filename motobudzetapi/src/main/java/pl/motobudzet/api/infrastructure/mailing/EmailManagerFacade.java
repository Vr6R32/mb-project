package pl.motobudzet.api.infrastructure.mailing;

import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import pl.motobudzet.api.domain.advertisement.entity.Advertisement;
import pl.motobudzet.api.domain.user.entity.AppUser;

import java.util.UUID;

@AllArgsConstructor
public class EmailManagerFacade {

    private final SpringMailSenderService mailSenderService;
    @Async
    public void sendMessageNotificationHtml(EmailMessageRequest request) {
        mailSenderService.sendMessageNotificationHtml(request);
    }
    @Async
    public void sendRegisterActivationNotificationHtml(AppUser user) {
        mailSenderService.sendRegisterActivationNotificationHtml(user);
    }
    @Async
    public void sendResetPasswordNotificationCodeLink(AppUser user) {
        mailSenderService.sendResetPasswordNotificationCodeLink(user);
    }
    @Async
    public void sendAdvertisementActivationConfirmNotification(AppUser user, Advertisement advertisement) {
        mailSenderService.sendAdvertisementActivationConfirmNotification(user,advertisement);
    }
    @Async
    public void sendEmailNotificationToManagement(UUID id) {
        mailSenderService.sendEmailNotificationToManagement(id);
    }


}
