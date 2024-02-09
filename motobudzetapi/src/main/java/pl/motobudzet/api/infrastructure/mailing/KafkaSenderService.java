package pl.motobudzet.api.infrastructure.mailing;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.model.EmailNotificationRequest;


@Service
@RequiredArgsConstructor
public class KafkaSenderService {

    private static final String MAILING_TOPIC = "mailing-service";

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendMessage(EmailNotificationRequest body) {
        kafkaTemplate.send(MAILING_TOPIC, body);
    }
}