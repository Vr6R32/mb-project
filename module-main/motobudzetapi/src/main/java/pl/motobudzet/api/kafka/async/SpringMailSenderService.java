package pl.motobudzet.api.kafka.async;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.kafka.dto.EmailMessageRequest;
import pl.motobudzet.api.user.entity.AppUser;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SpringMailSenderService {

    public static final String TITLE_NEW_CONVERSATION_MESSAGE = "Dostałeś nową wiadomość ";
    public static final String REGISTRATION_ACTIVATION_LINK = "Link aktywacyjny";
    public static final String INFO_MOTOBUDZET_PL_EMAIL = "info@motobudzet.pl";
    private final JavaMailSender mailSender;
    private final List<EmailMessageRequest> messageRequestList = new ArrayList<>();

    @Async
    public void sendMessageNotificationHtml(EmailMessageRequest request)  {

        if (!isMessageRequestAlreadySent(request)) {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = null;
            try {
                helper = new MimeMessageHelper(message, true);
                helper.setSubject(TITLE_NEW_CONVERSATION_MESSAGE);
                helper.setTo(request.getReceiverEmail());
                helper.setText(createHtmlStringMessageNotification(request), true);
                helper.setFrom(INFO_MOTOBUDZET_PL_EMAIL);
                FileSystemResource resource = new FileSystemResource(new File("module-main/files/private/logo.png"));
                helper.addInline("image001", resource);
                FileSystemResource resource2 = new FileSystemResource(new File("module-main/files/private/emailBackground.jpg"));
                helper.addInline("image002", resource2);
            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }
            messageRequestList.add(request);
            mailSender.send(message);
        }
    }

    @Async
    public void sendRegisterActivationNotificationHtml(AppUser user)  {

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = null;
            try {
                helper = new MimeMessageHelper(message, true);
                helper.setSubject(REGISTRATION_ACTIVATION_LINK);
                helper.setTo(user.getEmail());
                helper.setText(createHtmlStringRegisterActivation(user), true);
                helper.setFrom(INFO_MOTOBUDZET_PL_EMAIL);
                FileSystemResource resource = new FileSystemResource(new File("module-main/files/private/logo.png"));
                helper.addInline("image001", resource);
                FileSystemResource resource2 = new FileSystemResource(new File("module-main/files/private/emailBackground.jpg"));
                helper.addInline("image002", resource2);
            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }
            mailSender.send(message);
    }

    private String createHtmlStringRegisterActivation(AppUser user) {
        return "<center>" +
                "<table width='100%' style='text-align: center; padding: 20px; background-image: url(cid:image002); background-size: cover;'>" +
                "<tr><td>" +
                "<img src='cid:image001'/><br>" +
                "<b><font color='moccasin' size='+3'>" + "Witaj " + user.getUsername() + "</font></b><br>" +
                "<font color='darkgoldenrod'>Twój link aktywacyjny :</font><br>" +
                "<b><font color='moccasin' size='+3'>" + "<a href='http://localhost:20134/api/user?activationCode=" + user.getRegisterCode() + "'>Kliknij tutaj</a>" + "</font></b><br>" +
                "<hr>" +
                "<font color='darkgoldenrod' size='+2'>" +"Kliknij aby aktywowac swoje konto oraz dokończyć rejerstracje"+ "</font>" +
                "</td></tr></table>" +
                "</center>";
    }

    private String createHtmlStringMessageNotification(EmailMessageRequest request) {
        return "<center>" +
                "<table width='100%' style='text-align: center; padding: 20px; background-image: url(cid:image002); background-size: cover;'>" +
                "<tr><td>" +
                "<img src='cid:image001'/><br>" +
                "<font color='darkgoldenrod'>Wiadomość od użytkownika</font><br>" +
                "<b><font color='moccasin' size='+3'>" + request.getSenderName() + "</font></b><br>" +
                "<font color='darkgoldenrod'>Odnośnie ogłoszenia</font><br>" +
                "<b><font color='moccasin' size='+3'>" + request.getAdvertisementTitle() + "</font></b><br>" +
                "<hr>" +
                "<font color='darkgoldenrod' size='+2'>" + request.getMessage() + "</font>" +
                "</td></tr></table>" +
                "</center>";
    }

    private boolean isMessageRequestAlreadySent(EmailMessageRequest request) {
        for (EmailMessageRequest sentRequest : messageRequestList) {
            if (sentRequest.getSenderName().equals(request.getSenderName()) &&
                    sentRequest.getAdvertisementId().equals(request.getAdvertisementId())) {
                return true;
            }
        }
        return false;
    }
}
