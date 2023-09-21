package pl.motobudzet.api.kafka.service;

import pl.motobudzet.api.kafka.dto.EmailMessageRequest;

public interface KafkaServiceInterface {
    void sendMessageNotification(EmailMessageRequest message);

}
