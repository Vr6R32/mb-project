package pl.motobudzet.api.adapter.facade.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.KafkaTemplate;
import pl.motobudzet.api.adapter.facade.EmailManagerFacade;
import pl.motobudzet.api.infrastructure.kafka_queue.KafkaService;


@Configuration
@RequiredArgsConstructor
public class EmailManagerFacadeConfiguration {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Bean
    EmailManagerFacade emailManagerFacade() {
        KafkaService kafkaService = new KafkaService(kafkaTemplate);
        return new EmailManagerFacade(kafkaService);
    }
}
