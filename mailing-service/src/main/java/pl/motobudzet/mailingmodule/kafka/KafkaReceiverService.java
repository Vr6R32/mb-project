package pl.motobudzet.mailingmodule.kafka;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.model.EmailNotificationRequest;

import static pl.motobudzet.mailingmodule.kafka.KafkaConsumerConfig.MAILING_TOPIC;

@Service
@Slf4j
public class KafkaReceiverService {

    @KafkaListener(topics = MAILING_TOPIC, groupId = "mailing-service-group")
    public void listen(EmailNotificationRequest message) {
      log.info("[MAILING-SERVICE] recieved new email request -> {}", message);
    }
}