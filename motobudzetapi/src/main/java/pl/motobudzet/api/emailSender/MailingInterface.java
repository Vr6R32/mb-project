package pl.motobudzet.api.emailSender;

import pl.motobudzet.api.user_account.entity.AppUser;

public interface MailingInterface {
    void sendResetPasswordNotificationCodeLink(AppUser user);

    void sendRegisterActivationNotificationHtml(AppUser newUser);

}
