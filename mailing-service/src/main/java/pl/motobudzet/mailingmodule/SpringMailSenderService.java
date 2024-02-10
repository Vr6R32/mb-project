package pl.motobudzet.mailingmodule;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.model.EmailNotificationRequest;

@Service
@RequiredArgsConstructor
class SpringMailSenderService {

    public static final String BACKGROUND_IMAGE_URL = "https://motobudzet.pl/api/static/background_email";

    private final JavaMailSender mailSender;
    private final PathsConfig pathsConfig;

    private static final String NEW_CONVERSATION_MESSAGE_TITLE = "Dostałeś nową wiadomość ";
    private static final String REGISTRATION_ACTIVATION_TITLE = "Link aktywacyjny";
    private static final String ADVERTISEMENT_ACTIVATION_TITLE = "Aktywacja ogłoszenia";
    private static final String ADVERTISEMENT_TO_ACTIVATE = "Nowe ogłoszenie do zweryfikowania";
    private static final String ADVERTISEMENT_URL_LINK = "/advertisement?id=";
    private static final String RESET_PASSWORD_TITLE = "Resetowanie hasła";


    public void sendMessageNotification(EmailNotificationRequest request) {
        sendEmail(NEW_CONVERSATION_MESSAGE_TITLE, createHtmlStringMessageNotification(request), request.receiverEmail().get(0));
    }


    public void sendRegisterActivationNotification(EmailNotificationRequest request) {
        sendEmail(REGISTRATION_ACTIVATION_TITLE, createHtmlStringRegisterActivation(request), request.receiverEmail().get(0));
    }


    public void sendResetPasswordNotificationCodeLink(EmailNotificationRequest request) {
        sendEmail(RESET_PASSWORD_TITLE, createHtmlStringResetPassword(request), request.receiverEmail().get(0));
    }


    public void sendAdvertisementActivationConfirmNotification(EmailNotificationRequest request) {
        sendEmail(ADVERTISEMENT_ACTIVATION_TITLE, createHtmlStringActivationConfirmation(request), request.receiverEmail().get(0));
    }


    public void sendEmailNotificationToManagement(EmailNotificationRequest request) {
        sendEmail(ADVERTISEMENT_TO_ACTIVATE, createHtmlNewAdvertisementToActivate(request), request.receiverEmail().toArray(new String[0]));
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
        ClassPathResource logo = new ClassPathResource("logo.png");
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

    private String createHtmlStringRegisterActivation(EmailNotificationRequest request) {
        return "<center>" +
                "<table width='100%' style='text-align: center; padding: 20px; background-image: url(" + BACKGROUND_IMAGE_URL + "); background-size: cover;'>" +
                "<tr><td>" +
                "<img src='cid:image001'/><br>" +
                "<b><font color='moccasin' size='+3'>" + "Witaj " + request.userName() + "</font></b><br>" +
                "<font color='darkgoldenrod'>Twój link aktywacyjny :</font><br>" +
                "<b><font color='moccasin' size='+3'>" + "<a href='" + pathsConfig.getSiteUrlPath() + "/api/user/confirm?activationCode=" + request.userRegisterCode() + "'>Kliknij tutaj</a>" + "</font></b><br>" +
                "<hr>" +
                "<font color='darkgoldenrod' size='+2'>" + "Kliknij aby aktywowac swoje konto oraz dokończyć rejerstracje" + "</font>" +
                "</td></tr></table>" +
                "</center>";
    }

    private String createHtmlStringResetPassword(EmailNotificationRequest request) {
        return "<center>" +
                "<table width='100%' style='text-align: center; padding: 20px; background-image: url(" + BACKGROUND_IMAGE_URL + "); background-size: cover;'>" +
                "<tr><td>" +
                "<img src='cid:image001'/><br>" +
                "<b><font color='moccasin' size='+3'>" + "Witaj " + request.userName() + "</font></b><br>" +
                "<font color='darkgoldenrod'>Twój link resetujący hasło :</font><br>" +
                "<b><font color='moccasin' size='+3'>" + "<a href='" + pathsConfig.getSiteUrlPath() + "/reset?code=" + request.userResetPasswordCode() + "'>Kliknij tutaj</a>" + "</font></b><br>" +
                "<hr>" +
                "<font color='darkgoldenrod' size='+2'>" + "Kliknij aby zresetować swoje hasło." + "</font><br>" +
                "<font color='darkgoldenrod' size='+2'>" + "Jeśli nie prosiłeś o zmianę hasła, zignoruj tą wiadomość." + "</font>" +
                "</td></tr></table>" +
                "</center>";
    }

    private String createHtmlStringActivationConfirmation(EmailNotificationRequest request) {
        return "<center>" +
                "<table width='100%' style='text-align: center; padding: 20px; background-image: url(" + BACKGROUND_IMAGE_URL + "); background-size: cover;'>" +
                "<tr><td>" +
                "<img src='cid:image001'/><br>" +
                "<b><font color='moccasin' size='+3'>" + "Witaj " + request.userName() + "</font></b><br>" +
                "<font color='darkgoldenrod'>Twoje ogłoszenie <br>" + request.advertisementBrand() + request.advertisementModel() + "<br>"
                + request.advertisementTitle() + "<br> jest już widoczne !</font><br>" +
                "<b><font color='moccasin' size='+3'>" + "<a href='" + pathsConfig.getSiteUrlPath() + ADVERTISEMENT_URL_LINK + request.advertisementId() + "'>Kliknij tutaj</a>" + "</font></b><br>" +
                "<hr>" +
                "<font color='darkgoldenrod' size='+2'>" + "Kliknij aby przejść do swojego ogłoszenia." + "</font>" +
                "</td></tr></table>" +
                "</center>";
    }

    private String createHtmlNewAdvertisementToActivate(EmailNotificationRequest request) {
        return "<center>" +
                "<table width='100%' style='text-align: center; padding: 20px; background-image: url(" + BACKGROUND_IMAGE_URL + "); background-size: cover;'>" +
                "<tr><td>" +
                "<img src='cid:image001'/><br>" +
                "<b><font color='moccasin' size='+3'>" + "Witaj, pojawilo sie nowe ogłoszenie do aktywacji. " + "</font></b><br>" +
                "<font color='darkgoldenrod'>Wykonaj proszę weryfikacje ogłoszenia. <br>" + "<br></font><br>" +
                "<b><font color='moccasin' size='+3'>" + "<a href='" + pathsConfig.getSiteUrlPath() + ADVERTISEMENT_URL_LINK + request.advertisementId() + "'>Kliknij tutaj</a>" + "</font></b><br>" +
                "<hr>" +
                "<font color='darkgoldenrod' size='+2'>" + "Kliknij aby przejść do ogłoszenia." + "</font>" +
                "</td></tr></table>" +
                "</center>";
    }
}
