package pl.motobudzet.mailingmodule.dev;

import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.ListTopicsResult;
import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.KafkaFuture;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.*;

/**
 * The KafkaDevService is designed for developers to check messages on a specific Kafka topic
 * and list available topics. The information provided by this service is intended for
 * development purposes only and should not be used in a production environment.
 */

@Service
@Profile("docker")
@RequiredArgsConstructor
@SuppressWarnings("SpellCheckingInspection")
public class KafkaDevService {

    private final AdminClient adminClient;

    @Value("${spring.kafka.consumer.bootstrap-servers}")
    private String bootstrapServers;

    /**
     * Retrieves a list of available topics in the Kafka cluster.
     *
     * @return A set of topic names.
     */

    public Set<String> listTopics() {
        ListTopicsResult topicsResult = adminClient.listTopics();
        KafkaFuture<Set<String>> namesFuture = topicsResult.names();

        try {
            return namesFuture.get();
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptySet();
        }
    }

    /**
     * Retrieves messages from a specific topic in the Kafka cluster.
     *
     * @param topicName The name of the Kafka topic.
     * @return A list of messages from the topic.
     */

    public List<String> getTopicMessages(String topicName) {
        Properties properties = new Properties();
        properties.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        properties.put(ConsumerConfig.GROUP_ID_CONFIG, "management-consumer-group");
        properties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        properties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        properties.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "false");
        properties.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");

        try (Consumer<String, String> consumer = new KafkaConsumer<>(properties)) {
            consumer.subscribe(Collections.singletonList(topicName));
            ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(5000));
            List<String> messages = new ArrayList<>();
            if (!records.isEmpty()) {
                records.forEach(topicMessage -> {
                    String message = "Key: " + topicMessage.key() + ", Value: " + topicMessage.value();
                    messages.add(message);
                });
            } else {
                messages.add("Brak nowych wiadomości.");
            }
            return messages;
        } catch (Exception e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}
