package pl.motobudzet.api.kafka.service;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import static pl.motobudzet.api.kafka.configuration.KafkaTopicConfig.MESSAGE_NOTIFY_TOPIC;

@Service
@RequiredArgsConstructor
public class KafkaService {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public void sendMessageNotification(String message) {
      kafkaTemplate.send(MESSAGE_NOTIFY_TOPIC, message);
    }
}
