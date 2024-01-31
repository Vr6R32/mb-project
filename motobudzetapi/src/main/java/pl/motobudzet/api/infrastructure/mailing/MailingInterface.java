package pl.motobudzet.api.infrastructure.mailing;

import pl.motobudzet.api.domain.user.entity.AppUser;

public interface MailingInterface {
    void sendResetPasswordNotificationCodeLink(AppUser user);

    void sendRegisterActivationNotificationHtml(AppUser newUser);

}
