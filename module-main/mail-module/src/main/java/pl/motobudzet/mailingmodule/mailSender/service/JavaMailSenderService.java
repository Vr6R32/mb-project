package pl.motobudzet.mailingmodule.mailSender.service;

import jakarta.mail.Message;
import jakarta.mail.Session;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.kafka.dto.EmailMessageRequest;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import java.util.Properties;

//@Service
public class JavaMailSenderService {

    public void sendMessageNotificationEmail(EmailMessageRequest request) {

        final String username = "info@motobudzet.pl"; // Wpisz swoją nazwę użytkownika e-mail
        final String password = "dontgotosql"; // Wpisz hasło do swojego konta e-mail

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "serwer2379308.home.pl"); // Adres serwera SMTP dla Gmail
        props.put("mail.smtp.port", "587"); // Port serwera SMTP dla Gmail

        Session session = getSession(username, password, props);

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(request.getReceiverEmail())); // Adres odbiorcy
            message.setSubject("Dostałeś nową wiadomość ! ");
            message.setHeader("test 1", "test2");
            message.setText(" Od Użytkownika " + request.getSenderName() + " Odnośnie ogłoszenia " + request.getAdvertisementTitle() + "o treści " + request.getMessage());

            Transport.send(message);

            System.out.println("E-mail został pomyślnie wysłany.");

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    private Session getSession(String username, String password, Properties props) {
        return Session.getInstance(props,
                new Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(username, password);
                    }
                });
    }

}
