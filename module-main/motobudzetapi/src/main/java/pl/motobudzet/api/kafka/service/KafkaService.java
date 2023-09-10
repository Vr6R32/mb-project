package pl.motobudzet.api.kafka.service;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import static pl.motobudzet.api.kafka.configuration.KafkaTopicConfig.MESSAGE_NOTIFY_TOPIC;

@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "mailing.module.enabled", havingValue = "true")
public class KafkaService implements KafkaServiceInterface {

    private final KafkaTemplate<String, String> kafkaTemplate;

    @Override
    public void sendMessageNotification(String message) {
        kafkaTemplate.send(MESSAGE_NOTIFY_TOPIC, message);
    }
}




