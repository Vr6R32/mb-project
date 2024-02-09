package pl.motobudzet.api.infrastructure.mailing;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.domain.user.dto.AppUserDTO;
import pl.motobudzet.api.dto.AdvertisementDTO;
import pl.motobudzet.api.infrastructure.configuration.PathsConfig;
import pl.motobudzet.api.domain.user.service.UserDetailsService;

import java.io.File;
import java.util.UUID;

@Service
@RequiredArgsConstructor
class SpringMailSenderService {

    public static final String BACKGROUND_IMAGE_URL = "https://motobudzet.pl/api/static/background_email";

    private final JavaMailSender mailSender;
    private final PathsConfig pathsConfig;
    private final UserDetailsService userDetailsService;

    private static final String NEW_CONVERSATION_MESSAGE_TITLE = "Dostałeś nową wiadomość ";
    private static final String REGISTRATION_ACTIVATION_TITLE = "Link aktywacyjny";
    private static final String ADVERTISEMENT_ACTIVATION_TITLE = "Aktywacja ogłoszenia";
    private static final String ADVERTISEMENT_TO_ACTIVATE = "Nowe ogłoszenie do zweryfikowania";
    private static final String ADVERTISEMENT_URL_LINK = "/advertisement?id=";
    private static final String RESET_PASSWORD_TITLE = "Resetowanie hasła";


    public void sendMessageNotificationHtml(EmailNotificationRequest request) {
        sendEmail(NEW_CONVERSATION_MESSAGE_TITLE, createHtmlStringMessageNotification(request), request.receiverEmail());
    }


    public void sendRegisterActivationNotificationHtml(AppUserDTO user) {
        sendEmail(REGISTRATION_ACTIVATION_TITLE, createHtmlStringRegisterActivation(user), user.email());
    }


    public void sendResetPasswordNotificationCodeLink(AppUserDTO user) {
        sendEmail(RESET_PASSWORD_TITLE, createHtmlStringResetPassword(user), user.email());
    }


    public void sendAdvertisementActivationConfirmNotification(AppUserDTO user, AdvertisementDTO advertisement) {
        sendEmail(ADVERTISEMENT_ACTIVATION_TITLE, createHtmlStringActivationConfirmation(user, advertisement), user.email());
    }


    public void sendEmailNotificationToManagement(UUID id) {
        String[] receiverArray = userDetailsService.findManagementEmails().toArray(new String[0]);
        sendEmail(ADVERTISEMENT_TO_ACTIVATE, createHtmlNewAdvertisementToActivate(id), receiverArray);
    }


    private void sendEmail(String subject, String htmlContent, String... to) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(pathsConfig.getInfoEmailAddressPath());
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            addStaticResources(helper);
            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email.", e);
        }
    }


    private void addStaticResources(MimeMessageHelper helper) throws MessagingException {
        String logoPath = pathsConfig.getPrivateFilePath() + "logo.png";
        FileSystemResource logo = new FileSystemResource(new File(logoPath));
        helper.addInline("image001", logo);
    }

    private String createHtmlStringMessageNotification(EmailNotificationRequest request) {

        return "<center>" +
                "<table width='100%' style='text-align: center; padding: 20px; background-image: url(" + BACKGROUND_IMAGE_URL + "); background-size: cover;'>" +
                "<tr><td>" +
                "<img src='cid:image001'/><br>" +
                "<font color='darkgoldenrod'>Wiadomość od użytkownika</font><br>" +
                "<b><font color='moccasin' size='+3'>" + request.senderName() + "</font></b><br>" +
                "<font color='darkgoldenrod'>Odnośnie ogłoszenia</font><br>" +
                "<b><font color='moccasin' size='+3'>" + request.advertisementTitle() + "</font></b><br>" +
                "<hr>" +
                "<font color='darkgoldenrod' size='+2'>" + request.message() + "</font>" +
                "</td></tr></table>" +
                "</center>";
    }

    private String createHtmlStringRegisterActivation(AppUserDTO user) {
        return "<center>" +
                "<table width='100%' style='text-align: center; padding: 20px; background-image: url(" + BACKGROUND_IMAGE_URL + "); background-size: cover;'>" +
                "<tr><td>" +
                "<img src='cid:image001'/><br>" +
                "<b><font color='moccasin' size='+3'>" + "Witaj " + user.userName() + "</font></b><br>" +
                "<font color='darkgoldenrod'>Twój link aktywacyjny :</font><br>" +
                "<b><font color='moccasin' size='+3'>" + "<a href='" + pathsConfig.getSiteUrlPath() + "/api/user/confirm?activationCode=" + user.registerCode() + "'>Kliknij tutaj</a>" + "</font></b><br>" +
                "<hr>" +
                "<font color='darkgoldenrod' size='+2'>" + "Kliknij aby aktywowac swoje konto oraz dokończyć rejerstracje" + "</font>" +
                "</td></tr></table>" +
                "</center>";
    }

    private String createHtmlStringResetPassword(AppUserDTO user) {
        return "<center>" +
                "<table width='100%' style='text-align: center; padding: 20px; background-image: url(" + BACKGROUND_IMAGE_URL + "); background-size: cover;'>" +
                "<tr><td>" +
                "<img src='cid:image001'/><br>" +
                "<b><font color='moccasin' size='+3'>" + "Witaj " + user.userName() + "</font></b><br>" +
                "<font color='darkgoldenrod'>Twój link resetujący hasło :</font><br>" +
                "<b><font color='moccasin' size='+3'>" + "<a href='" + pathsConfig.getSiteUrlPath() + "/reset?code=" + user.resetPasswordCode() + "'>Kliknij tutaj</a>" + "</font></b><br>" +
                "<hr>" +
                "<font color='darkgoldenrod' size='+2'>" + "Kliknij aby zresetować swoje hasło." + "</font><br>" +
                "<font color='darkgoldenrod' size='+2'>" + "Jeśli nie prosiłeś o zmianę hasła, zignoruj tą wiadomość." + "</font>" +
                "</td></tr></table>" +
                "</center>";
    }

    private String createHtmlStringActivationConfirmation(AppUserDTO user, AdvertisementDTO advertisement) {
        return "<center>" +
                "<table width='100%' style='text-align: center; padding: 20px; background-image: url(" + BACKGROUND_IMAGE_URL + "); background-size: cover;'>" +
                "<tr><td>" +
                "<img src='cid:image001'/><br>" +
                "<b><font color='moccasin' size='+3'>" + "Witaj " + user.userName() + "</font></b><br>" +
                "<font color='darkgoldenrod'>Twoje ogłoszenie <br>" + advertisement.brand().name() + advertisement.model().name() + "<br>"
                + advertisement.name() + "<br> jest już widoczne !</font><br>" +
                "<b><font color='moccasin' size='+3'>" + "<a href='" + pathsConfig.getSiteUrlPath() + ADVERTISEMENT_URL_LINK + advertisement.id() + "'>Kliknij tutaj</a>" + "</font></b><br>" +
                "<hr>" +
                "<font color='darkgoldenrod' size='+2'>" + "Kliknij aby przejść do swojego ogłoszenia." + "</font>" +
                "</td></tr></table>" +
                "</center>";
    }

    private String createHtmlNewAdvertisementToActivate(UUID id) {
        return "<center>" +
                "<table width='100%' style='text-align: center; padding: 20px; background-image: url(" + BACKGROUND_IMAGE_URL + "); background-size: cover;'>" +
                "<tr><td>" +
                "<img src='cid:image001'/><br>" +
                "<b><font color='moccasin' size='+3'>" + "Witaj, pojawilo sie nowe ogłoszenie do aktywacji. " + "</font></b><br>" +
                "<font color='darkgoldenrod'>Wykonaj proszę weryfikacje ogłoszenia. <br>" + "<br></font><br>" +
                "<b><font color='moccasin' size='+3'>" + "<a href='" + pathsConfig.getSiteUrlPath() + ADVERTISEMENT_URL_LINK + id + "'>Kliknij tutaj</a>" + "</font></b><br>" +
                "<hr>" +
                "<font color='darkgoldenrod' size='+2'>" + "Kliknij aby przejść do ogłoszenia." + "</font>" +
                "</td></tr></table>" +
                "</center>";
    }

}
