package pl.motobudzet.api.infrastructure.kafka_queue;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import pl.motobudzet.api.model.EmailNotificationRequest;


@RequiredArgsConstructor
public class KafkaService {

    private static final String MAILING_TOPIC = "mailing-service";

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendMessage(EmailNotificationRequest body) {
        kafkaTemplate.send(MAILING_TOPIC, body);
    }
}