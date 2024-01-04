package pl.motobudzet.api.emailSender.configuration;

import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;
import pl.motobudzet.api.emailSender.EmailMessageRequest;

import java.util.HashMap;
import java.util.Map;

@Configuration
@ConditionalOnProperty(name = "mailing.module.enabled", havingValue = "true")
public class KafkaProducerConfig {

    @Value("${spring.kafka.bootstrap-servers}")

    private String bootstrapServers;

    public Map<String, Object> producerConfig() {
        HashMap<String, Object> properties = new HashMap<>();
        properties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        properties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        return properties;
    }

    @Bean
    public ProducerFactory<String, EmailMessageRequest> producerFactory() {
        return new DefaultKafkaProducerFactory<>(producerConfig());
    }

//    @Bean
//    public ProducerFactory<String, EmailMessageRequest> producerFactory() {
//        return new DefaultKafkaProducerFactory<>(producerConfig(), new StringSerializer(), new JsonSerializer<>(EmailMessageRequest.class));
//    }

    @Bean
    public KafkaTemplate<String, EmailMessageRequest> kafkaTemplate(ProducerFactory<String, EmailMessageRequest> producerFactory) {
        return new KafkaTemplate<>(producerFactory());
    }
}
