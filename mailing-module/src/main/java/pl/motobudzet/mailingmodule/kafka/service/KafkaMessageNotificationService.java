package pl.motobudzet.mailingmodule.kafka.service;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import pl.motobudzet.mailingmodule.mailSender.service.MailSenderService;


@Component
@RequiredArgsConstructor
public class KafkaMessageNotificationService {

    private final MailSenderService mailSenderService;

    public static final String MESSAGE_NOTIFY_TOPIC = "messageNotify1";

    @KafkaListener(topics = MESSAGE_NOTIFY_TOPIC, groupId = "groupid1")
    void listener(String data) {

        mailSenderService.sendMessageNotificationEmail(data);
    }
}
