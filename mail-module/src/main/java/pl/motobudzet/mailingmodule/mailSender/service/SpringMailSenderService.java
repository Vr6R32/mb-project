package pl.motobudzet.mailingmodule.mailSender.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.emailSender.dto.EmailMessageRequest;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SpringMailSenderService {

    public static final String TITLE_NEW_CONVERSATION_MESSAGE = "Dostałeś nową wiadomość ";
    public static final String INFO_MOTOBUDZET_PL_EMAIL = "info@motobudzet.pl";
    private final JavaMailSender mailSender;
    private List<EmailMessageRequest> messageRequestList = new ArrayList<>();

    public void sendMessageNotificationPlainText(EmailMessageRequest request){

        SimpleMailMessage email = new SimpleMailMessage();

//        email.setFrom("Użytkownik : " + request.getSenderName());
        email.setTo(request.getReceiverEmail());
        email.setFrom(INFO_MOTOBUDZET_PL_EMAIL);
        email.setSubject(TITLE_NEW_CONVERSATION_MESSAGE);
        email.setText(request.getMessage());

        mailSender.send(email);

    }

    public void sendMessageNotificationHtml(EmailMessageRequest request)  {

        if (!isMessageRequestAlreadySent(request)) {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = null;
            try {
                helper = new MimeMessageHelper(message, true);
                helper.setSubject(TITLE_NEW_CONVERSATION_MESSAGE);
                helper.setTo(request.getReceiverEmail());
                helper.setText(createHtmlString(request), true);
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

//    private String createHtmlString(EmailMessageRequest request) {
//        return "<center>" +
//                "<img src='cid:image001'/>" + "<br>" +
//                "Wiadomość od użytkownika " + "<br><b><font color='darkgoldenrod' size='+5'>" + request.getSenderName() + "</font></b>" + "<br>" +
//                "Odnośnie ogłoszenia" + "<br><b><font color='darkgoldenrod' size='+3'>" + request.getAdvertisementTitle() + "</font></b>" + "<br>" +
//                request.getMessage() +
//                "</center>";
//    }

//    private String createHtmlString(EmailMessageRequest request) {
//        return "<table width='100%' bgcolor=#181818 style='text-align: center; padding: 20px;'>" +
//                "<tr><td>" +
//                "<img src='cid:image001'/><br>" +
//                "<font color=white>Wiadomość od użytkownika</font><br><b><font color='darkgoldenrod' size='+5'>" + request.getSenderName() + "</font></b><br>" +
//                "<span style='color: white;'>Odnośnie ogłoszenia</span><br><b><font color='darkgoldenrod' size='+3'>" + request.getAdvertisementTitle() + "</font></b><br>" +
//                "<span style='color: white;'>" + request.getMessage() + "</span>" +
//                "</td></tr></table>";
//    }

    private String createHtmlString(EmailMessageRequest request) {
        return "<center>" +
                "<table width='100%' style='text-align: center; padding: 20px; background-image: url(cid:image002); background-size: cover;'>" +
                "<tr><td>" +
                "<img src='cid:image001'/><br>" +
                "<font color='darkgoldenrod'>Wiadomość od użytkownika</font><br>" +
                "<b><font color='moccasin' size='+3'>" + request.getSenderName() + "</font></b><br>" +
                "<font color='darkgoldenrod'>Odnośnie ogłoszenia</font><br>" +
                "<b><font color='moccasin' size='+3'>" + request.getAdvertisementTitle() + "</font></b><br>" +
                "<hr>" + // Dodaj linię <hr> po treści wiadomości
                "<font color='darkgoldenrod' size='+2'>" + request.getMessage() + "</font>" +
                "</td></tr></table>" +
                "</center>";
    }

//    private String createHtmlString(EmailMessageRequest request) {
//        return "<center>" +
//                "<table width='100%' style='text-align: center; padding: 20px;'>" +
//                "<tr><td style='background-image: src(cid:image002); background-size: cover;'>" +
//                "<img src='cid:image001'/><br>" +
//                "<font color='darkgoldenrod'>Wiadomość od użytkownika</font><br>" +
//                "<b><font color='moccasin' size='+3'>" + request.getSenderName() + "</font></b><br>" +
//                "<font color='darkgoldenrod'>Odnośnie ogłoszenia</font><br>" +
//                "<b><font color='moccasin' size='+3'>" + request.getAdvertisementTitle() + "</font></b><br>" +
//                "<hr>" + // Dodaj linię <hr> po treści wiadomości
//                "<font color='darkgoldenrod' size='+2'>" + request.getMessage() + "</font>" +
//                "</td></tr></table>" +
//                "</center>";
//    }


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
