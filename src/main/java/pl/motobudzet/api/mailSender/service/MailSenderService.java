package pl.motobudzet.api.mailSender.service;

import java.util.Properties;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

@Service
public class MailSenderService {




//    @EventListener(ApplicationReadyEvent.class)
    public void sendEmail() {

    final String username = "info@motobudzet.pl"; // Wpisz swoją nazwę użytkownika e-mail
    final String password = "dontgotosql"; // Wpisz hasło do swojego konta e-mail

    Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "serwer2379308.home.pl"); // Adres serwera SMTP dla Gmail
        props.put("mail.smtp.port", "587"); // Port serwera SMTP dla Gmail

        Session session = Session.getInstance(props,
                new jakarta.mail.Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(username, password);
                    }
                });

        try {
        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(username));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse("ind00rsm0k3rs@gmail.com")); // Adres odbiorcy
        message.setSubject("Testowy e-mail");
        message.setText("To jest testowy e-mail wysłany z użyciem JavaMailSender.");

        Transport.send(message);

        System.out.println("E-mail został pomyślnie wysłany.");

    } catch (MessagingException e) {
        e.printStackTrace();
    }
}

}
