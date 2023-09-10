package pl.motobudzet.api.kafka.configuration;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    public static final String MESSAGE_NOTIFY_TOPIC = "messageNotify1";
    @Bean
    public NewTopic mailingTopic() {
        return TopicBuilder.name(MESSAGE_NOTIFY_TOPIC).replicas(1).partitions(3).build();
    }
}
