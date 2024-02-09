package pl.motobudzet.api.infrastructure.mailing;

import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import pl.motobudzet.api.model.EmailNotificationRequest;

@AllArgsConstructor
public class EmailManagerFacade {

    private final SpringMailSenderService mailSenderService;
    @Async
    public void sendMessageNotificationHtml(EmailNotificationRequest request) {
        mailSenderService.sendMessageNotificationHtml(request);
    }
    @Async
    public void sendRegisterActivationNotificationHtml(EmailNotificationRequest request) {
        mailSenderService.sendRegisterActivationNotificationHtml(request);
    }
    @Async
    public void sendResetPasswordNotificationCodeLink(EmailNotificationRequest request) {
        mailSenderService.sendResetPasswordNotificationCodeLink(request);
    }
    @Async
    public void sendAdvertisementActivationConfirmNotification(EmailNotificationRequest request) {
        mailSenderService.sendAdvertisementActivationConfirmNotification(request);
    }
    @Async
    public void sendEmailNotificationToManagement(EmailNotificationRequest request) {
        mailSenderService.sendEmailNotificationToManagement(request);
    }


}
