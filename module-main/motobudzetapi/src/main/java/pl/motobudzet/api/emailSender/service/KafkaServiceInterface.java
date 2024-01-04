package pl.motobudzet.api.emailSender.service;

import pl.motobudzet.api.emailSender.EmailMessageRequest;

public interface KafkaServiceInterface {
    void sendMessageNotification(EmailMessageRequest message);

}
