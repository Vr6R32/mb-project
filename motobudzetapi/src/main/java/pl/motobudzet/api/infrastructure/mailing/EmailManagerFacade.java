package pl.motobudzet.api.infrastructure.mailing;

import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import pl.motobudzet.api.domain.user.dto.AppUserDTO;
import pl.motobudzet.api.dto.AdvertisementDTO;

import java.util.UUID;

@AllArgsConstructor
public class EmailManagerFacade {

    private final SpringMailSenderService mailSenderService;
    @Async
    public void sendMessageNotificationHtml(EmailNotificationRequest request) {
        mailSenderService.sendMessageNotificationHtml(request);
    }
    @Async
    public void sendRegisterActivationNotificationHtml(AppUserDTO user) {
        mailSenderService.sendRegisterActivationNotificationHtml(user);
    }
    @Async
    public void sendResetPasswordNotificationCodeLink(AppUserDTO user) {
        mailSenderService.sendResetPasswordNotificationCodeLink(user);
    }
    @Async
    public void sendAdvertisementActivationConfirmNotification(AppUserDTO user, AdvertisementDTO advertisement) {
        mailSenderService.sendAdvertisementActivationConfirmNotification(user,advertisement);
    }
    @Async
    public void sendEmailNotificationToManagement(UUID id) {
        mailSenderService.sendEmailNotificationToManagement(id);
    }


}
