package pl.motobudzet.api.kafka.service;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import static pl.motobudzet.api.kafka.configuration.KafkaTopicConfig.MESSAGE_NOTIFY_TOPIC;

@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "mailing.module.enabled", havingValue = "false")
public class KafkaServiceFake implements KafkaServiceInterface {

    private final KafkaTemplate<String, String> kafkaTemplate;

    @Override
    public void sendMessageNotification(String message) {
        System.out.println("Kafka fake message notification  ! ;)");
    }
}




