package pl.motobudzet.api.adapter.facade;

import lombok.AllArgsConstructor;
import pl.motobudzet.api.infrastructure.kafka_queue.KafkaService;
import pl.motobudzet.api.model.EmailNotificationRequest;

@AllArgsConstructor
public class EmailManagerFacade {

    private final KafkaService kafkaService;

    public void publishEmailNotificationEvent(EmailNotificationRequest request) {
        kafkaService.sendMessage(request);
    }

}
