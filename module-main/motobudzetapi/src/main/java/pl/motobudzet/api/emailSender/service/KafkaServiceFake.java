package pl.motobudzet.api.emailSender.service;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import pl.motobudzet.api.emailSender.dto.EmailMessageRequest;

@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "mailing.module.enabled", havingValue = "false")
public class KafkaServiceFake implements KafkaServiceInterface {

    private final KafkaTemplate<String, EmailMessageRequest> kafkaTemplate;

    @Override
    public void sendMessageNotification(EmailMessageRequest request) {
        System.out.println("Kafka fake message notification  ! ;)");
    }
}




