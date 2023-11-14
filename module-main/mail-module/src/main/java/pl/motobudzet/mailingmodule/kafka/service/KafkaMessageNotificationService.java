package pl.motobudzet.mailingmodule.kafka.service;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.emailSender.dto.EmailMessageRequest;
import pl.motobudzet.mailingmodule.mailSender.service.JavaMailSenderService;
import pl.motobudzet.mailingmodule.mailSender.service.SpringMailSenderService;
//import pl.motobudzet.mailingmodule.mailSender.service.SpringMailSenderService;

import static pl.motobudzet.api.emailSender.configuration.KafkaTopicConfig.MESSAGE_NOTIFY_TOPIC;


@Service
@RequiredArgsConstructor
public class KafkaMessageNotificationService {

//    private final JavaMailSenderService javaMailSenderService;
    private final SpringMailSenderService springMailSenderService;

    @KafkaListener(topics = MESSAGE_NOTIFY_TOPIC, groupId = "groupid1",containerFactory = "factory")
    void listener(EmailMessageRequest request) {
        springMailSenderService.sendMessageNotificationHtml(request);
    }
}
