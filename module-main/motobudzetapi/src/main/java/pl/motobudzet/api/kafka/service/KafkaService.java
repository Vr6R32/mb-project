package pl.motobudzet.api.kafka.service;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.kafka.dto.EmailMessageRequest;

import static pl.motobudzet.api.kafka.configuration.KafkaTopicConfig.MESSAGE_NOTIFY_TOPIC;

@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "mailing.module.enabled", havingValue = "true")
public class KafkaService implements KafkaServiceInterface {

    private final KafkaTemplate<String, EmailMessageRequest> kafkaTemplate;

    @Override
    public void sendMessageNotification(EmailMessageRequest messageNotificationRequest) {
        kafkaTemplate.send(MESSAGE_NOTIFY_TOPIC, messageNotificationRequest);
    }
}




